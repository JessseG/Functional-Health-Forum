import { Prisma } from "@prisma/client"; // check
import {
  faThumbsUp,
  faThumbsDown,
  faCaretUp,
  faAngleUp,
  faAngleDown,
  faArrowUp,
  faCaretDown,
  faTrash,
  faTrashAlt,
  faTrashRestore,
  faPen,
  faComment,
  faShare,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetchDedupe } from "fetch-dedupe";
import "react-quill/dist/quill.snow.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useModalContext } from "./Layout";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import TextareaAutosize from "react-textarea-autosize";
import { reverse } from "dns/promises";
import Modal from "./Modal";

export const DeletePostContext = createContext<Function | null>(null); // deletePost()

export const useDeletePost = () => {
  return useContext(DeletePostContext);
};

// const ReactQuill =
//   typeof window === "object" ? require("react-quill") : () => false;

type FullPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    community: true;
    comments: { include: { user: true } };
    votes: true;
  };
}>;

type ComWithPosts = Prisma.CommunityGetPayload<{
  include: {
    posts: { include: { user: true; community: true; votes: true } };
    comments: true;
    joinedUsers: true;
    protocol: true;
  };
}>;

interface Props {
  post: FullPost;
  comUrl: string;
  fullCom: ComWithPosts;
  modal: Function;
}

const Post = ({ post, comUrl, fullCom, modal }: Props) => {
  const [showComments, setShowComments] = useState({
    toggle: false,
    quantity: 3,
  });
  const [showAllComments, setShowAllComments] = useState(false);
  const [editedPost, setEditedPost] = useState({
    id: post.id,
    body: post.body,
    edit: false,
  });
  const [replyPost, setReplyPost] = useState({ body: "", reply: false });
  const [showFullPost, setShowFullPost] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const { com } = router.query;
  const [postBodyHeight, setPostBodyHeight] = useState(0);
  const postBodyRef = useRef(null);
  const modalRef = useRef(null);

  // const handleModal = useModalContext();

  useEffect(() => {
    // Used this for ... show more arrow on post body/details
    setPostBodyHeight(postBodyRef?.current?.clientHeight);
    // console.log(postBodyRef?.current?.clientHeight);
    if (editedPost.body !== post.body) {
      setEditedPost((state) => ({
        ...state,
        body: post.body,
      }));
    }
  }, [post.body, showFullPost]);

  // check if user has voted on the post
  const hasVoted = post.votes.find((vote) => vote.userId === session?.userId);

  const votePost = async (type) => {
    // if user isn't logged-in, redirect to login page
    if (!session && !loading) {
      router.push("/login");
      return;
    }

    // STUDY MORE
    // if user has voted, remove vote from cache
    if (hasVoted) {
      // check if vote type is same as existing vote

      if (hasVoted.voteType !== type) {
        mutate(
          comUrl,
          async (state = fullCom) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  return {
                    ...currentPost,
                    votes: currentPost.votes.map((vote) => {
                      if (vote.userId === session.userId) {
                        return {
                          ...vote,
                          voteType: type,
                        };
                        return vote;
                      } else {
                        return vote;
                      }
                    }),
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      } else {
        mutate(
          comUrl,
          async (state) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  return {
                    ...currentPost,
                    votes: currentPost.votes.filter(
                      (vote) => vote.userId !== session.userId
                    ),
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      }
    } else {
      mutate(
        comUrl,
        async (state = fullCom) => {
          return {
            ...state,
            posts: state.posts.map((currentPost) => {
              if (currentPost.id === post.id) {
                return {
                  ...currentPost,
                  votes: [
                    ...currentPost.votes,
                    {
                      voteType: type,
                      userId: session.userId,
                      postId: currentPost.id,
                    },
                  ],
                };
              } else {
                return currentPost;
              }
            }),
          };
        },
        false
      );
    }

    await fetchDedupe("/api/posts/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id, type }),
    });

    // revalidates the cache change from database
    mutate(comUrl);
  };

  const handleReplyPost = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    if (replyPost.body === "") {
      return;
    }

    // create local reply
    const reply = {
      body: replyPost.body,
      post: post,
      community: com,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session?.userId,
        },
      ],
      user: session?.user,
    };

    // FIX HERE
    // mutate (update local cache)
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          posts: state.posts.map((currentPost) => {
            if (currentPost.id === post.id && post.id === session.userId) {
              return {
                ...currentPost,
                comments: [...currentPost.comments, reply],
              };
            } else {
              return currentPost;
            }
          }),
          // comments: [...state.comments, reply],
        };
      },
      false
    );

    // api request
    NProgress.start();
    await fetch("/api/posts/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply: reply }),
    });

    setReplyPost((state) => ({
      ...state,
      body: "",
      reply: false,
    }));
    NProgress.done();

    // validate & route back to our posts
    mutate(comUrl);
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();

    if (post.userId !== session?.userId) {
      return;
    }

    const selection = await modalRef.current.handleModal("delete post");

    if (selection === "Cancel" || selection === "" || selection === null) {
      return;
    } else if (selection === "Delete") {
      // mutate (update local cache)
      mutate(
        comUrl,
        async (state) => {
          return {
            ...state,
            posts: state.posts.filter(
              (currentPost) => currentPost.id !== post.id
            ),
          };
        },
        false
      );

      NProgress.start();
      await fetch("/api/posts/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });
      NProgress.done();

      // validate & route back to our posts
      mutate(comUrl);

      // router.push(`/communities/${com}`);
    }
  };

  const handleSharePost = async (e) => {
    e.preventDefault();

    const nextAuthUrl = window.location.origin;

    const selection = await modalRef.current.handleModal(
      "share post",
      `${nextAuthUrl}/communities/${fullCom.name}/${post.id}`
    );
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    if (post.userId !== session?.userId || editedPost.body === "") {
      return;
    }

    setDisableClick(true);

    // mutate (update local cache) - for the current com (from within post component)
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          posts: state.posts.map((currentPost) => {
            if (currentPost.id === post.id) {
              return {
                ...currentPost,
                body: editedPost.body,
              };
            } else {
              return currentPost;
            }
          }),
        };
      },
      false
    );

    NProgress.start();
    await fetch("/api/posts/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: { id: post.id, body: editedPost.body } }),
    });

    setDisableClick(false);
    NProgress.done();

    // validate & route back to our posts
    mutate(comUrl);

    setEditedPost((state) => ({
      ...state,
      edit: false,
    }));

    // router.push(`/communities/${com}`);
  };

  const calculateVoteCount = (votes) => {
    const upvotes = votes.filter((vote) => vote.voteType === "UPVOTE");
    const downvotes = votes.filter((vote) => vote.voteType === "DOWNVOTE");

    const voteCount = upvotes.length - downvotes.length;
    return voteCount;
  };

  const stripHtml = (html) => {
    var strippedHtml = html.replace(/<[^>]+>/g, "");
    return strippedHtml;
  };

  const handleRouteToProtocol = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <DeletePostContext.Provider value={handleDeletePost}>
      <div
        className="w-full bg-color-posts hover:bg-white rounded-md pt-3.5 pb-3.5 pr-3 mt-3"
        // onClick={() => handleRouteToProtocol()}
      >
        <Modal
          ref={modalRef}
          // showModal={showModal}
          // modalMode={modalMode}
          // shareLink={""}
          // closeDownModal={closeDownModal}
          // handleModalPromise={handleModalPromise}
        />
        <div className="flex border-black px-1">
          <div className="flex flex-col min-w-2/32 max-w-2/32 mx-4 sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-2.5 items-center">
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretUp}
              className={`${
                hasVoted?.voteType === "UPVOTE"
                  ? "text-red-500"
                  : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-red-500`}
              onClick={() => votePost("UPVOTE")}
            />
            <p className="text-base text-center mx-1.5">
              {calculateVoteCount(post.votes) || 0}
            </p>
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretDown}
              className={`${
                hasVoted?.voteType === "DOWNVOTE"
                  ? "text-blue-500"
                  : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-blue-500`}
              onClick={() => votePost("DOWNVOTE")}
            />
          </div>
          <div className="w-full mr-7 pr-1 border-black">
            <span className="text-sm text-gray-500">
              Posted by{" "}
              <span className="text-green-800 mr-1">{post.user?.name} </span> –
              <Moment interval={1000} className="text-gray-500 ml-2" fromNow>
                {post.createdAt}
              </Moment>
            </span>
            {/* Post Title */}
            <p className="text-xl font-semibold text-gray-850 ml-0.5 mt-[0.5rem] mb-[0.6rem]">
              {post.title}
            </p>
            {/* Post Content */}
            {!editedPost.edit && (
              <p
                ref={postBodyRef}
                className={`text-gray-900 ml-0.5 pr-0 border-black ${
                  showFullPost ? "" : "leading-6 max-h-[9rem] overflow-hidden"
                }`}
              >
                {stripHtml(post.body)}
              </p>
            )}
            {/* EDIT POST COMPONENTS */}
            {editedPost.edit && post.userId === session?.userId && (
              <div className="mt-1 rounded-sm border-blue-300 container p-1 border-0 shadow-lg ring-gray-300 ring-2">
                <TextareaAutosize
                  autoFocus={true}
                  onFocus={(e) => {
                    var val = e.target.value;
                    e.target.value = "";
                    e.target.value = val;
                  }}
                  minRows={2}
                  className="text-gray-600 block container px-3 py-1 outline-none no-scroll"
                  placeholder="Content"
                  value={stripHtml(editedPost.body)}
                  onChange={(e) =>
                    setEditedPost((state) => ({
                      ...state,
                      body: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {/* POST OPTIONS BOX */}
            <div className="mt-3 flex flex-nowrap justify-between border-black">
              <div className="mt-1 flex flex-row post-options-box flex-wrap pl-0.5 border-red-500 inline-flex text-sm++">
                {/* SHARE POST */}
                <div onClick={(e) => handleSharePost(e)}>
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faShare}
                    className="cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  />
                  <span className="post-options ml-1.5 font-semibold text-purple-500 cursor-pointer">
                    share
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (post.comments?.length !== 0) {
                      setShowComments((state) => ({
                        ...state,
                        toggle: !showComments.toggle,
                      }));
                      // console.log(showComments.toggle);
                    }
                  }}
                >
                  {/* POST COMMENTS ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faComment}
                    className="ml-6 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    onClick={() => console.log("comment?")}
                  />

                  {/* POST COMMENTS TEXT */}
                  <span className="post-options ml-1.5 font-semibold text-purple-500 cursor-pointer">
                    {`${post.comments?.length || 0} ${
                      post.comments?.length === 1 ? "reply" : "replies"
                    }`}
                  </span>
                </div>

                <div
                  onClick={() => {
                    setReplyPost((state) => ({
                      ...state,
                      reply: !replyPost.reply,
                    }));
                    if (editedPost.edit) {
                      setEditedPost((state) => ({
                        ...state,
                        edit: !editedPost.edit,
                      }));
                    }
                  }}
                >
                  {/* REPLY POST ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faReply}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  />

                  {/* REPLY POST TEXT */}
                  <span className="post-options ml-1 font-semibold text-purple-500 cursor-pointer">
                    reply
                  </span>
                </div>

                {/* EDIT POST BOX */}
                {post.userId === session?.userId && (
                  <div
                    onClick={() => {
                      setEditedPost((state) => ({
                        ...state,
                        edit: !editedPost.edit,
                      }));
                      if (replyPost.reply) {
                        setReplyPost((state) => ({
                          ...state,
                          reply: !replyPost.reply,
                        }));
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faPen}
                      className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    />
                    <span className="post-options ml-1 font-semibold text-purple-500 cursor-pointer">
                      edit
                    </span>
                  </div>
                )}

                {/* DELETE POST ICON */}
                {post.userId === session?.userId && (
                  <div onClick={(e) => handleDeletePost(e)}>
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faTrash}
                      className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                    />
                    <span className="post-options ml-2 font-semibold text-purple-500 cursor-pointer">
                      delete
                    </span>
                  </div>
                )}
              </div>

              {post.userId === session?.userId && editedPost.edit && (
                <span className="border-black">
                  <button
                    disabled={disableClick}
                    onClick={(e) => handleEditPost(e)}
                    className="text-gray-800 font-semibold cursor-pointer bg-purple-300 rounded-[0.15rem] px-2.5 py-0.5 border ring-1 ring-gray-400 border-zinc-400"
                  >
                    Save
                  </button>
                </span>
              )}

              {/* SHOW HIDE/SHOW ARROWS */}
              {!editedPost.edit && postBodyHeight > 134.5 && (
                <div className="border-black -mt-2.5 mr-3">
                  {!showFullPost && (
                    <div
                      className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                      onClick={() => {
                        setShowFullPost(true);
                      }}
                    >
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faAngleDown}
                        className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                      />
                    </div>
                  )}
                  {showFullPost && (
                    <div
                      className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                      onClick={() => {
                        setShowFullPost(false);
                      }}
                    >
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faAngleUp}
                        className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* REPLY POST BOX */}
            {replyPost.reply && (
              <div>
                <div className="mx-auto my-4 px-3 py-2 border border-gray-400 rounded">
                  {/* <div className="mt-1 rounded-sm border-blue-300 container p-1 border-0 shadow-lg ring-gray-300 ring-2"> */}
                  <TextareaAutosize
                    autoFocus={true}
                    onFocus={(e) => {
                      var val = e.target.value;
                      e.target.value = "";
                      e.target.value = val;
                    }}
                    minRows={2}
                    className="text-gray-600 block container px-1.5 py-1 outline-none no-scroll"
                    placeholder="Reply"
                    value={replyPost.body}
                    onChange={(e) =>
                      setReplyPost((state) => ({
                        ...state,
                        body: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  className="border-black flex flex-col"
                  onClick={(e) => handleReplyPost(e)}
                >
                  {/* <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  /> */}
                  <div className="text-gray-800 text-center font-semibold cursor-pointer bg-purple-300 rounded px-2.5 py-1.5 border ring-1 ring-gray-400 border-zinc-400">
                    Reply
                  </div>
                </div>
              </div>
            )}
            <div
              className="border-black"
              style={
                showComments.toggle ? { display: "block" } : { display: "none" }
              }
            >
              {post.comments
                ?.slice(0)
                .reverse()
                .map((comment, id) => {
                  if (showAllComments) {
                  } else if (id >= showComments.quantity) {
                    return null;
                  }
                  return (
                    <div
                      key={comment.id}
                      className="mx-auto mt-5 mb-3 px-3 py-2 border-t border-l border-gray-400 rounded-tl"
                    >
                      <div className="mb-1 text-sm text-gray-500">
                        <span className="text-green-800">
                          {comment.user.name}
                        </span>{" "}
                        –
                        <span>
                          <Moment className="text-gray-500 ml-2" fromNow>
                            {comment.createdAt}
                          </Moment>
                        </span>
                      </div>
                      <div>{comment.body}</div>
                    </div>
                  );
                })}
              <div className="text-right pr-3 py-0 -mb-1">
                {showAllComments && (
                  <span
                    className="underline-offset-4 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => {
                      setShowComments((state) => ({ ...state, toggle: false })),
                        setShowAllComments(false);
                    }}
                  >
                    hide all replies....
                  </span>
                )}
                {!showAllComments && (
                  <span
                    className="underline-offset-4 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    show all replies....
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DeletePostContext.Provider>
  );
};

export default Post;

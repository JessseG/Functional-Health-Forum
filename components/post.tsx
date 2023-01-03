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
  faEllipsis,
  faCloudArrowUp,
  faSquareArrowUpRight,
  faArrowDown,
  faCaretSquareUp,
  faCaretSquareDown,
  faCheck,
  faSyringe,
  faRocket,
  faCircleXmark,
  faCircleCheck,
  faCommentAlt,
  faComments,
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
import Select from "react-select";
import Modal from "./Modal";
import Image from "next/image";

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
    access: false,
  });
  const [replyPost, setReplyPost] = useState({ body: "", reply: false });
  const [disabledVote, setDisabledVote] = useState(false);
  const [showFullPost, setShowFullPost] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [disableClick, setDisableClick] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const ellipsisRef = useRef(null);
  const moreOptionsRef = useRef(null);
  const { com } = router.query;
  const [postBodyHeight, setPostBodyHeight] = useState(0);
  const postBodyRef = useRef(null);
  const modalRef = useRef(null);
  const [sessionlessVoteId, setSessionlessVoteId] = useState<any>(null);
  const [protocolReplySubmitted, setProtocolReplySubmitted] = useState(false);
  const [selectMoreOptions, setSelectMoreOptions] = useState(false);
  const [postReplySubmitted, setPostReplySubmitted] = useState(false);
  const [hasVotedState, setHasVotedState] = useState(null);
  const [postOptions, setPostOptions] = useState<any>({
    share: null,
    comments: null,
    reply: null,
    edit: null,
    delete: null,
  });
  // const handleModal = useModalContext();

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  });

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
  }, [post.body, showFullPost, windowWidth]);

  // check if user has voted on the post
  const hasVoted = post.votes.find((vote) => vote.userId === session?.userId);

  const votePost = async (type) => {
    // if user isn't logged-in, redirect to login page
    // if (!session && !loading) {
    //   router.push("/login");
    //   return;
    // }

    //________________________________________________
    // STUDY MORE
    // if user has voted, remove vote from cache
    if (session) {
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
    }
    // Sessionless Vote
    else {
      if (disabledVote) {
        return;
      }
      setDisabledVote(true);

      let changeType =
        hasVotedState === null
          ? "create"
          : hasVotedState === type
          ? "delete"
          : hasVotedState !== type
          ? "update"
          : "";

      if (hasVotedState !== null) {
        /* check if vote type is same as existing vote
           if not then change the type
        */
        if (hasVotedState !== type) {
          // change vote type - PERFECT
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
                        if (vote.id === sessionlessVoteId) {
                          return {
                            ...vote,
                            voteType: type,
                          };
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
          // remove same vote - PERFECT
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
                        (vote, i) => vote.id !== sessionlessVoteId
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
        // add new vote - PERFECT
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

      // ALTERNATIVE STATE HANDLING FOR SESSIONLESS
      if (hasVotedState === null) {
        // Assign Vote
        setHasVotedState(type);
      } else if (hasVotedState === type) {
        // Delete Vote
        setHasVotedState(null);
      } else if (hasVotedState !== type) {
        // Change Vote
        setHasVotedState(type);
      }

      await fetchDedupe("/api/posts/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          voteId: sessionlessVoteId,
          type,
          changeType,
        }),
      }).then((data) => {
        setDisabledVote(false);
        mutate(comUrl);
        setSessionlessVoteId(data.data.id);
      });

      // revalidates the cache change from database
      // mutate(comUrl);
    }
  };

  // console.log(
  //   "outside UPVOTES: ",
  //   post.votes.filter((vote) => vote.voteType === "UPVOTE")
  // );
  // console.log(
  //   "outside DOWNVOTES: ",
  //   post.votes.filter((vote) => {
  //     return vote.voteType === "DOWNVOTE";
  //   })
  // );

  // console.log("\n\n");

  const handleReplyPost = async () => {
    // e.preventDefault();

    // if (!session) {
    //   router.push("/login");
    //   return;
    // }

    setProtocolReplySubmitted(true);

    if (replyPost.body === "") {
      return;
    }

    if (session) {
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
    } else {
      const selection = await modalRef.current.handleModal(
        "create reply",
        null,
        post.id
      );

      // console.log(selection);
      if (
        selection.selection === "Cancel" ||
        selection.selection === "" ||
        selection.selection === null ||
        selection.selection === undefined
      ) {
        setDisableClick(false);
        return;
      } else if (selection.selection === "Login") {
        router.push(
          {
            query: {
              callbackReplyContent: replyPost.body,
              callbackPostUrl: router.asPath,
            },
            pathname: "/login",
          },
          "/login"
        );
        return;
      } else if (selection.selection === "Quick") {
        // create local reply
        const reply = {
          accessEmail: selection.email,
          body: replyPost.body,
          post: post,
          community: com,
          votes: [
            {
              voteType: "UPVOTE",
            },
          ],
        };

        // FIX HERE
        // mutate (update local cache)
        mutate(
          comUrl,
          async (state) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  return {
                    ...currentPost,
                    comments: [...currentPost.comments, reply],
                  };
                } else {
                  return currentPost;
                }
              }),
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
      }
    }
  };

  const handleDeletePost = async () => {
    // e.preventDefault();

    // if (post.userId !== session?.userId) {
    //   return;
    // }

    if (session) {
      if (session.userId !== post.userId) {
        return;
      }
    }
    if (modalRef && modalRef.current) {
      const selection = await modalRef.current.handleModal(
        "delete post",
        null,
        post.id
      );

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
    }
  };

  const handleSharePost = async () => {
    // e.preventDefault();

    const nextAuthUrl = window.location.origin;

    await modalRef.current.handleModal(
      "share post",
      `${nextAuthUrl}/communities/${fullCom.name}/${post.id}`
    );
  };

  const handleEditPost = async () => {
    // e.preventDefault();

    if (session) {
      if (editedPost.body === "") {
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
    } else {
      if (editedPost.access && editedPost.edit) {
        if (editedPost.body === "" || editedPost.body === post.body) {
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
          body: JSON.stringify({
            post: { id: post.id, body: editedPost.body },
          }),
        }).then(() => {
          setDisableClick(false);
        });
        NProgress.done();

        // validate & route back to our posts
        mutate(comUrl);

        setEditedPost((state) => ({
          ...state,
          edit: false,
        }));
      } else if (editedPost.access && !editedPost.edit) {
        setEditedPost((state) => ({
          ...state,
          edit: true,
        }));
      } else {
        if (modalRef && modalRef.current) {
          const selection = await modalRef.current.handleModal(
            "edit post",
            null,
            post.id
          );

          if (
            selection === "Cancel" ||
            selection === "" ||
            selection === null
          ) {
            return;
          } else if (selection === "Edit") {
            if (!editedPost.edit) {
              setEditedPost((state) => ({
                ...state,
                access: true,
                edit: true,
              }));
              return;
            }
          }
        }
      }
    }
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

  const handleClickOutside = (ref1: any, ref2: any) => {
    const clickOutside = (e: any) => {
      if (
        ref1.current &&
        !ref1.current.contains(e.target) &&
        ref2.current &&
        !ref2.current.contains(e.target)
      ) {
        setSelectMoreOptions(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", clickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", clickOutside);
    };
  };

  useEffect(() => {
    if (selectMoreOptions) {
      handleClickOutside(moreOptionsRef, ellipsisRef);
    }
  }, [selectMoreOptions]);

  const handleRouteToProtocol = () => {
    router.push(`/post/${post.id}`);
  };

  const moreOptions = [
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faShare}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">share</span>
        </>
      ),
      value: "share",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faReply}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">reply</span>
        </>
      ),
      value: "reply",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faPen}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">edit</span>
        </>
      ),
      value: "edit",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faTrash}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">delete</span>
        </>
      ),
      value: "delete",
    },
  ];

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
        <div className="relative flex py-0.5 border-black px-1">
          {/* POST VOTES CONTAINER */}
          {460 <= windowWidth && (
            <div
              className={`flex flex-col border-black w-2/32 ${
                windowWidth < 450
                  ? "ml-3 mr-3"
                  : 450 < windowWidth && windowWidth <= 640
                  ? "ml-3 mr-3"
                  : "sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-2.5"
              }`}
            >
              <FontAwesomeIcon
                size={"2x"}
                icon={faCaretUp}
                className={`${
                  hasVotedState === "UPVOTE" ? "text-red-500" : "text-gray-600"
                } cursor-pointer text-gray-600 hover:text-red-500`}
                onClick={() => votePost("UPVOTE")}
              />
              <div className="text-base text-center mx-1.5">
                {calculateVoteCount(post.votes) || 0}
              </div>
              <FontAwesomeIcon
                size={"2x"}
                icon={faCaretDown}
                className={`${
                  hasVotedState === "DOWNVOTE"
                    ? "text-blue-500"
                    : "text-gray-600"
                } cursor-pointer text-gray-600 hover:text-blue-500`}
                onClick={() => votePost("DOWNVOTE")}
              />
            </div>
          )}

          {/* ELLIPSIS MORE OPTIONS */}
          {/* <div
            className={`inline-block absolute right-4 top-3 border-black ${
              windowWidth < 475 ? `ml-9` : `ml-12`
            }`}
          >
            <span title="Show all options" ref={ellipsisRef}>
              <FontAwesomeIcon
                size={"lg"}
                icon={faEllipsis}
                onClick={(e) => setSelectMoreOptions(!selectMoreOptions)}
                className="cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
              />
            </span>
            <div
              ref={moreOptionsRef}
              className={`${
                selectMoreOptions ? `inline-block` : `hidden`
              } mx-auto absolute right-0 top-3.5 w-[7rem]`}
            >
              <Select
                menuIsOpen={selectMoreOptions}
                // hideSelectedOptions={true}
                components={{ IndicatorSeparator: null }}
                placeholder="Hotel"
                className={`px-3 flex flex-row border-none bg-transparent outline-none `}
                // className={`px-3 flex flex-row relative bg-white rounded-sm border-0 ring-2 shadow-md outline-none `}
                // tabSelectsValue={false}
                options={moreOptions}
                value={postOptions.hotel}
                instanceId="select-reservation-hotel"
                // isClearable={true}
                onChange={(option) => {
                  // setReservation((state: any) => ({
                  //   ...state,
                  //   hotel: option,
                  // }));
                  switch (option.value) {
                    case "share":
                      handleSharePost();
                      break;

                    case "reply":
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
                      break;

                    case "edit":
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
                      break;

                    case "delete":
                      handleDeletePost();
                      break;
                  }
                  setSelectMoreOptions(!selectMoreOptions);
                }}
                styles={{
                  container: (base) => ({
                    ...base,
                    // display: "",
                    // height: "100px",
                  }),
                  control: (base) => ({
                    ...base,
                    // height: "100px",
                    display: "none",
                    fontSize: "1.06rem",
                    background: "white",
                    borderRadius: "3px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "none",
                    width: "100%",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    // display: "none",
                    padding: "0",
                    background: "transparent",
                    outline: "none",
                    border: "none",
                    margin: "0",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    display: "none",
                    background: "transparent",
                    color: "rgb(75, 85, 99)",
                    width: "100%",
                  }),
                  input: (base) => ({
                    ...base,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "rgb(156 163 175)",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "94.5%",
                  }),
                  menuList: (base) => ({
                    ...base,
                    width: "full",
                    backgroundColor: "rgb(240, 240, 240)",
                    border: "1px solid gray",
                    "::-webkit-scrollbar": {
                      width: "0px",
                      height: "0px",
                    },
                    "::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#888",
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                  }),
                  option: (
                    base,
                    { data, isDisabled, isFocused, isSelected }
                  ) => ({
                    ...base,
                    color: "black",
                    fontSize: "1rem",
                    padding: "0.15rem 1rem 0.15rem 1rem",
                    width: "full",
                    cursor: "pointer",
                    backgroundColor: `${
                      isFocused
                        ? "#dfe6ef"
                        : isSelected
                        ? "transparent"
                        : "transparent"
                    }`,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    display: "none",
                    userSelect: "none",
                    backgroundColor: "transparent",
                    background: "transparent",
                    padding: "0 0 0 0",
                    margin: "0",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: 0,
                    alignSelf: "center",
                    color: "gray",
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    padding: "0",
                    marginRight: "0.4rem",
                    backgroundColor: "transparent",
                    margin: "0",
                  }),
                  groupHeading: (base) => ({
                    ...base,
                    color: "#FBA500",
                  }),
                }}
              />
            </div>
          </div> */}

          {/* POST CONTENT BOX ________  INNER CONTENT PADDING MARGINS   */}
          <div
            className={`w-full pr-1 border-black ${
              460 <= windowWidth ? "mr-7" : "ml-5 mr-2"
            }`}
          >
            <span className="text-sm ml-0.5 text-gray-500">
              Posted by{" "}
              <span className="text-green-800 mr-1">
                {post.user?.name || "RandomUser"}{" "}
              </span>{" "}
              –
              <Moment interval={1000} className="text-gray-500 ml-2" fromNow>
                {post.createdAt}
              </Moment>
            </span>

            {/* Post Title */}
            <p className="text-xl font-semibold text-gray-850 ml-0.5 mt-[0.5rem] mb-[0.6rem]">
              {post.title}
            </p>

            {/* Post Body Content */}
            {!editedPost.edit && (
              <div>
                <div
                  ref={postBodyRef}
                  className={`text-gray-900 ml-0.5 -mr-1.5 pr-0 leading-6 border-black ${
                    !showFullPost ? "max-h-[9rem] overflow-hidden" : ""
                  }`}
                >
                  {stripHtml(post.body)}
                </div>
                {/* SHOW HIDE/SHOW ARROWS */}
                {!editedPost.edit && postBodyHeight > 135 && (
                  <div className="text-right -mb-4 border-black mr-0.5">
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
            )}

            {/* EDIT POST COMPONENTS */}
            {/* {editedPost.edit && post.userId === session?.userId && ( */}
            {editedPost.edit && (
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
            <div className="mt-3 mr-4 flex flex-nowrap justify-between border-black">
              <div className="mt-1 flex-row flex-nowrap pl-1 border-red-500 inline-flex items-center text-sm++">
                {/* PROTOCOL VOTES BOX */}
                {windowWidth < 460 && (
                  <div
                    className={`flex flex-row rounded-lg ring-gray-500 pt-0.5 border-black justify-between mr-4 ${
                      windowWidth < 500
                        ? `ml-[0.21rem]`
                        : windowWidth < 765
                        ? `ml-1.5`
                        : `ml-1.5`
                    }`}
                  >
                    {/* <FontAwesomeIcon
                      icon={faCircleCheck}
                      className={`${
                        calculateVoteCount(post.votes) > 0
                          ? "text-emerald-600"
                          : "text-gray-400"
                        //   hasVoted?.voteType === "UPVOTE"
                        //   ? "text-red-500"
                        //   : "text-emerald-600"
                        // // : "text-purple-500"
                      } cursor-pointer text-black hover:text-emerald-600 hover:saturate-5 text-[1.4rem]`}
                      onClick={() => votePost("UPVOTE")}
                    /> */}
                    <div className="cursor-pointer relative w-[2.2rem] h-[1.3rem] bg-transparent">
                      <Image
                        layout="fill"
                        onClick={() => votePost("UPVOTE")}
                        className={`
                        ${
                          hasVotedState === "UPVOTE"
                            ? "-hue-rotate-30"
                            : "grayscale-[100%] -hue-rotate-30 hover:grayscale-0"
                        }`}
                        src="/images/arrowUp.png"
                        alt="Upvote"
                      />
                    </div>
                    <div className="text-base text-center w-full -mx-[0.25rem] border-red-500">
                      {/* 29 */}
                      {calculateVoteCount(post.votes) || 0}
                    </div>
                    <div className="cursor-pointer relative mt-[0.04rem] w-[2.2rem] h-[1.3rem] bg-transparent">
                      <Image
                        layout="fill"
                        onClick={() => votePost("DOWNVOTE")}
                        className={`rotate-180 ${
                          hasVotedState === "DOWNVOTE"
                            ? "-hue-rotate-[165deg]"
                            : "grayscale-[100%] hover:-hue-rotate-[165deg] hover:grayscale-0"
                        }`}
                        src="/images/arrowUp.png"
                        alt="Downvote"
                      />
                    </div>
                    {/* <FontAwesomeIcon
                      icon={faCircleXmark}
                      className={`${
                        calculateVoteCount(post.votes) < 0
                          ? "text-blue-500"
                          : "text-gray-400"
                        //  hasVoted?.voteType === "DOWNVOTE"
                        //  ? "text-blue-500"
                        //  : "text-gray-400"
                      } cursor-pointer text-black hover:text-blue-500 text-[1.37rem]`}
                      onClick={() => votePost("DOWNVOTE")}
                    /> */}
                  </div>
                )}

                {/* Options Container */}
                <div className="flex flex-row post-options-box flex-wrap pl-0.5 border-green-500 text-sm++">
                  {/* SHARE POST */}
                  <div
                    className={`cursor-pointer inline-block ${
                      windowWidth < 460 ? "ml-1" : ""
                    }`}
                    onClick={() => handleSharePost()}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faShare}
                      className="text-gray-600 hover:text-red-500 align middle mt-0.25 invert-25 hover:invert-0"
                    />
                    <span className="post-options ml-1.5 font-semibold text-purple-500">
                      share
                    </span>
                  </div>

                  {/* POST COMMENTS BOX */}
                  <div
                    className={`inline-block border-black cursor-pointer ${
                      windowWidth < 765 ? `ml-4` : `ml-6`
                    }`}
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
                      className="text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                      onClick={() => console.log("comment?")}
                    />

                    {/* POST COMMENTS TEXT */}
                    <span className="post-options ml-1.5 font-semibold text-purple-500">
                      {`${post.comments?.length || 0} ${
                        post.comments?.length === 1 ? "reply" : "replies"
                      }`}
                    </span>
                  </div>

                  {/* REPLY POST BOX */}
                  <div
                    className={`inline-block border-black cursor-pointer ${
                      windowWidth < 765 ? `ml-3.5` : `ml-5`
                    }`}
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
                      className="text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    />

                    {/* REPLY POST TEXT */}
                    <span className="post-options ml-1 font-semibold text-purple-500">
                      reply
                    </span>
                  </div>

                  {/* EDIT POST BOX */}
                  {/* {post.userId === session?.userId && ( */}
                  <div
                    className={`inline-block cursor-pointer border-black ${
                      windowWidth < 765 ? `ml-4` : `ml-6`
                    }`}
                    onClick={() => {
                      if (replyPost.reply) {
                        setReplyPost((state) => ({
                          ...state,
                          reply: !replyPost.reply,
                        }));
                      }
                      handleEditPost();
                    }}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faPen}
                      className="text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    />
                    <span className="post-options ml-1 font-semibold text-purple-500">
                      edit
                    </span>
                  </div>

                  {/* DELETE POST ICON */}
                  {/* {post.userId === session?.userId && ( */}

                  <div
                    onClick={() => handleDeletePost()}
                    className={`inline-block cursor-pointer border-black ${
                      windowWidth < 765 ? `ml-4 pl-0.5` : `ml-6`
                    }`}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faTrash}
                      className="text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                    />
                    <span className="post-options ml-2 font-semibold text-purple-500">
                      delete
                    </span>
                  </div>
                </div>

                {/* ELLIPSIS MORE OPTIONS */}
                <div
                  className={`relative inline-flex items-center mt-0.5 border-black ${
                    windowWidth < 460 && !editedPost.edit
                      ? `pl-0.5 ml-4 -mr-1`
                      : windowWidth < 460 && editedPost.edit
                      ? `pl-0.5 ml-4 mr-2`
                      : `ml-7 mr-7`
                  }`}
                >
                  <span title="Show all options" ref={ellipsisRef}>
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faEllipsis}
                      onClick={(e) => setSelectMoreOptions(!selectMoreOptions)}
                      className="cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                    />
                  </span>
                  <div
                    ref={moreOptionsRef}
                    className={`${
                      selectMoreOptions ? `inline-block` : `hidden`
                    } mx-auto absolute w-[7rem] ${
                      windowWidth < 460 ? "right-0 top-6" : "-left-4 top-5"
                    }`}
                  >
                    <Select
                      menuIsOpen={selectMoreOptions}
                      // hideSelectedOptions={true}
                      components={{ IndicatorSeparator: null }}
                      placeholder="Hotel"
                      className={`px-3 flex flex-row border-none bg-transparent outline-none `}
                      // className={`px-3 flex flex-row relative bg-white rounded-sm border-0 ring-2 shadow-md outline-none `}
                      // tabSelectsValue={false}
                      options={moreOptions}
                      value={postOptions.hotel}
                      instanceId="select-reservation-hotel"
                      // isClearable={true}
                      onChange={(option) => {
                        // setReservation((state: any) => ({
                        //   ...state,
                        //   hotel: option,
                        // }));
                        switch (option.value) {
                          case "share":
                            handleSharePost();
                            break;

                          case "reply":
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
                            break;

                          case "edit":
                            if (replyPost.reply) {
                              setReplyPost((state) => ({
                                ...state,
                                reply: !replyPost.reply,
                              }));
                            }
                            handleEditPost();
                            break;

                          case "delete":
                            handleDeletePost();
                            break;
                        }
                        setSelectMoreOptions(!selectMoreOptions);
                      }}
                      styles={{
                        container: (base) => ({
                          ...base,
                          // display: "",
                          // height: "100px",
                        }),
                        control: (base) => ({
                          ...base,
                          // height: "100px",
                          display: "none",
                          fontSize: "1.06rem",
                          background: "white",
                          borderRadius: "3px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "none",
                          width: "100%",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          // display: "none",
                          padding: "0",
                          background: "transparent",
                          outline: "none",
                          border: "none",
                          margin: "0",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          display: "none",
                          background: "transparent",
                          color: "rgb(75, 85, 99)",
                          width: "100%",
                        }),
                        input: (base) => ({
                          ...base,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "rgb(156 163 175)",
                        }),
                        menu: (base) => ({
                          ...base,
                          width: "94.5%",
                        }),
                        menuList: (base) => ({
                          ...base,
                          width: "full",
                          backgroundColor: "rgb(240, 240, 240)",
                          border: "1px solid gray",
                          "::-webkit-scrollbar": {
                            width: "0px",
                            height: "0px",
                          },
                          "::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                          },
                          "::-webkit-scrollbar-thumb": {
                            background: "#888",
                          },
                          "::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                          },
                        }),
                        option: (
                          base,
                          { data, isDisabled, isFocused, isSelected }
                        ) => ({
                          ...base,
                          color: "black",
                          fontSize: "1rem",
                          padding: "0.15rem 1rem 0.15rem 1rem",
                          width: "full",
                          cursor: "pointer",
                          backgroundColor: `${
                            isFocused
                              ? "#dfe6ef"
                              : isSelected
                              ? "transparent"
                              : "transparent"
                          }`,
                        }),
                        indicatorsContainer: (base) => ({
                          ...base,
                          display: "none",
                          userSelect: "none",
                          backgroundColor: "transparent",
                          background: "transparent",
                          padding: "0 0 0 0",
                          margin: "0",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: 0,
                          alignSelf: "center",
                          color: "gray",
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          padding: "0",
                          marginRight: "0.4rem",
                          backgroundColor: "transparent",
                          margin: "0",
                        }),
                        groupHeading: (base) => ({
                          ...base,
                          color: "#FBA500",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* {post.userId === session?.userId && editedPost.edit && ( */}
              {editedPost.edit && (
                <span
                  className={`mt-1 ${
                    windowWidth <= 550
                      ? "ml-4 -mr-3"
                      : 765 <= windowWidth
                      ? "ml-4 -mr-3"
                      : "ml-4 mr-2"
                  } border-black`}
                >
                  <button
                    disabled={disableClick}
                    onClick={() => handleEditPost()}
                    className="select-none text-gray-800 font-semibold cursor-pointer bg-purple-300 rounded-[0.15rem] px-2.5 py-[0.18rem] ring-1 ring-gray-400 border-zinc-400"
                  >
                    Save
                  </button>
                </span>
              )}

              {/* SHOW HIDE/SHOW ARROWS */}
              {/* {!editedPost.edit && postBodyHeight > 134.5 && (
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
              )} */}
            </div>

            {/* REPLY POST BOX */}
            {replyPost.reply && (
              <div>
                <div
                  className={`mx-auto my-4 px-3 py-2 border rounded ${
                    postReplySubmitted && replyPost.body === ""
                      ? `border-rose-500`
                      : `border-gray-400`
                  }`}
                >
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
                  className="ml-auto border-black flex flex-col"
                  onClick={() => handleReplyPost()}
                >
                  {/* <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  /> */}
                  <div className="text-gray-800 text-center font-semibold cursor-pointer bg-purple-300 rounded px-2.5 py-1.5 ring-1 ring-gray-400 border-zinc-400">
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
                    // return [];
                  }
                  return (
                    <div
                      key={id}
                      className="mx-auto mt-5 mb-3 px-3 py-2 border-t border-l border-gray-400 rounded-tl"
                    >
                      <div className="mb-1 text-sm text-gray-500">
                        <span className="text-green-800">
                          {comment?.user?.name || "RandomUser"}
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

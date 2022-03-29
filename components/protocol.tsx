import { Prisma } from "@prisma/client"; // check
import {
  faThumbsUp,
  faThumbsDown,
  faSortAmountUp,
  faArrowAltCircleUp,
  faCaretUp,
  faHandPointUp,
  faHandPointDown,
  faAngleUp,
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
import { createContext, useContext, useState } from "react";
import Moment from "react-moment";
import TextareaAutosize from "react-textarea-autosize";
import { reverse } from "dns/promises";

export const DeletePostContext = createContext<Function | null>(null); // deletePost()

export const useDeletePost = () => {
  return useContext(DeletePostContext);
};

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

// post
type FullPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    subreddit: true;
    comments: { include: { user: true } };
    votes: true;
  };
}>;

// protocol
type FullProtocol = Prisma.ProtocolGetPayload<{
  include: {
    user: true;
    subreddit: true;
    comments: { include: { user: true } };
    votes: true;
  };
}>;

// fullSub
type SubWithPosts = Prisma.SubredditGetPayload<{
  include: {
    posts: { include: { user: true; subreddit: true; votes: true } };
    comments: true;
    joinedUsers: true;
    Protocols: { include: { user: true; subreddit: true; votes: true } };
  };
}>;

interface Props {
  protocol: FullProtocol;
  subUrl: string;
  fullSub: SubWithPosts;
  modal: Function;
}

const Protocol = ({ protocol, subUrl, fullSub, modal }: Props) => {
  const [showComments, setShowComments] = useState({
    toggle: false,
    quantity: 3,
  });
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editedPost, setEditedPost] = useState({
    id: protocol.id,
    body: protocol.body,
    edit: false,
  });
  const [replyPost, setReplyPost] = useState({ body: "", reply: false });
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const { sub } = router.query;
  const handleModal = useModalContext();

  // check if user has voted on the post
  //   const hasVoted = protocol.votes.find(
  //     (vote) => vote.userId === session?.userId
  //   );

  // console.log(fullSub);
  const votePost = async (type) => {
    // // if user isn't logged-in, redirect to login page
    // if (!session && !loading) {
    //   router.push("/login");
    //   return;
    // }
    // // STUDY MORE
    // // if user has voted, remove vote from cache
    // if (hasVoted) {
    //   // check if vote type is same as existing vote
    //   if (hasVoted.voteType !== type) {
    //     mutate(
    //       subUrl,
    //       async (state = fullSub) => {
    //         return {
    //           ...state,
    //           Protocols: state.Protocols.map((currentProtocol) => {
    //             if (currentProtocol.id === protocol.id) {
    //               return {
    //                 ...currentProtocol,
    //                 votes: currentProtocol.votes.map((vote) => {
    //                   if (vote.userId === session.userId) {
    //                     return {
    //                       ...vote,
    //                       voteType: type,
    //                     };
    //                     return vote;
    //                   } else {
    //                     return vote;
    //                   }
    //                 }),
    //               };
    //             } else {
    //               return currentProtocol;
    //             }
    //           }),
    //         };
    //       },
    //       false
    //     );
    //   } else {
    //     mutate(
    //       subUrl,
    //       async (state) => {
    //         return {
    //           ...state,
    //           Protocols: state.Protocols.map((currentProtocol) => {
    //             if (currentProtocol.id === protocol.id) {
    //               return {
    //                 ...currentProtocol,
    //                 votes: currentProtocol.votes.filter(
    //                   (vote) => vote.userId !== session.userId
    //                 ),
    //               };
    //             } else {
    //               return currentProtocol;
    //             }
    //           }),
    //         };
    //       },
    //       false
    //     );
    //   }
    // } else {
    //   mutate(
    //     subUrl,
    //     async (state = fullSub) => {
    //       return {
    //         ...state,
    //         Protocols: state.Protocols.map((currentProtocol) => {
    //           if (currentProtocol.id === protocol.id) {
    //             return {
    //               ...currentProtocol,
    //               votes: [
    //                 ...currentProtocol.votes,
    //                 {
    //                   voteType: type,
    //                   userId: session.userId,
    //                   postId: currentProtocol.id,
    //                 },
    //               ],
    //             };
    //           } else {
    //             return currentProtocol;
    //           }
    //         }),
    //       };
    //     },
    //     false
    //   );
    // }
    // await fetchDedupe("/api/posts/vote", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ protocolId: protocol.id, type }),
    // });
    // // revalidates the cache change from database
    // mutate(subUrl);
  };

  const handleReplyPost = async (e) => {
    e.preventDefault();

    // if (!newPost.title) {
    //   setRingColor("transition duration-700 ease-in-out ring-red-400");
    //   return;
    // }

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
      protocol: protocol,
      subReddit: sub,
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
      subUrl,
      async (state) => {
        return {
          ...state,
          Protocols: state.Protocols.map((currentProtocol) => {
            if (
              currentProtocol.id === protocol.id &&
              protocol.id === session.userId
            ) {
              return {
                ...currentProtocol,
                comments: [...currentProtocol.comments, reply],
              };
            } else {
              return currentProtocol;
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
    mutate(subUrl);
  };

  const handleDeletePost = async () => {
    // e.preventDefault();

    const selection = await handleModal();

    if (selection === "Cancel" || selection === "" || selection === null) {
      return;
    } else if (selection === "Delete") {
      // mutate (update local cache)
      mutate(
        subUrl,
        async (state) => {
          return {
            ...state,
            Protocols: state.Protocols.filter(
              (currentProtocol) =>
                currentProtocol.id !== protocol.id &&
                currentProtocol.userId === session?.userId
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
        body: JSON.stringify({ protocolId: protocol.id }),
      });
      NProgress.done();

      // validate & route back to our posts
      mutate(subUrl);

      // router.push(`/communities/${sub}`);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    // mutate (update local cache) - for the current sub (from within protocol component)
    mutate(
      subUrl,
      async (state) => {
        return {
          ...state,
          Protocols: state.Protocols.map((currentProtocol) => {
            if (
              currentProtocol.id === protocol.id &&
              currentProtocol.userId === session?.userId
            ) {
              return {
                ...currentProtocol,
                body: editedPost.body,
              };
            } else {
              return currentProtocol;
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
        protocol: { id: protocol.id, body: editedPost.body },
      }),
    });
    NProgress.done();

    // validate & route back to our posts
    mutate(subUrl);

    setEditedPost((state) => ({
      ...state,
      edit: false,
    }));

    // router.push(`/communities/${sub}`);
  };

  //   const calculateVoteCount = (votes) => {
  //     const upvotes = votes.filter((vote) => vote.voteType === "UPVOTE");
  //     const downvotes = votes.filter((vote) => vote.voteType === "DOWNVOTE");

  //     const voteCount = upvotes.length - downvotes.length;
  //     return voteCount;
  //   };

  const stripHtml = (html) => {
    var strippedHtml = html.replace(/<[^>]+>/g, "");
    return strippedHtml;
  };

  return (
    <DeletePostContext.Provider value={handleDeletePost}>
      {/* <hr className="even:border-t border-zinc-300" /> */}
      <div className="w-full mt-3 bg-white pt-3 pb-3.5 rounded border-red-400">
        {/* PROTOCOL VOTES & CONTENT CONTAINER */}
        <div className="flex border-black px-1">
          {/* PROTOCOL VOTES */}
          <div className="flex flex-col px-4 items-center border-purple-500">
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretUp}
              onClick={() => votePost("UPVOTE")}
              className={`${
                false ? "text-red-500" : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-red-500`}
              //   className={`${
              //     hasVoted?.voteType === "UPVOTE"
              //       ? "text-red-500"
              //       : "text-gray-600"
              //   } cursor-pointer text-gray-600 hover:text-red-500`}
            />
            <p className="text-base text-center mx-1.5">
              {/* {calculateVoteCount(protocol.votes) || 0} */}0
            </p>
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretDown}
              onClick={() => votePost("DOWNVOTE")}
              className={`${
                false ? "text-blue-500" : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-blue-500`}
              //   className={`${
              //     hasVoted?.voteType === "DOWNVOTE"
              //       ? "text-blue-500"
              //       : "text-gray-600"
              //   } cursor-pointer text-gray-600 hover:text-blue-500`}
            />
          </div>
          {/* PROTOCOL CONTENT BOX */}
          <div className="w-full mr-5 border-blue-500">
            <span className="text-sm text-gray-500">
              Posted by{" "}
              <span className="text-green-800 mr-1">
                {protocol.user?.name}{" "}
              </span>{" "}
              –
              <Moment interval={1000} className="text-gray-500 ml-2" fromNow>
                {fullSub.createdAt}
              </Moment>
            </span>
            {/* Protocol Title */}
            <p className="text-xl font-semibold text-gray-850 my-1.5">
              {protocol.title}
            </p>
            {/* PROTOCOL CHECKLIST */}
            <div className="-ml-1 rounded mr-7 pt-2 pb-3 border-red-400">
              <ul className="ml-7 font-semibold">
                <li className="" style={{ listStyleType: "square" }}>
                  Berberine HCL -
                  <span className="font-normal">
                    {" "}
                    (800mg) - 3x Daily pre-Mastic Gum
                  </span>
                </li>
                <li className="" style={{ listStyleType: "square" }}>
                  Mastic Gum -
                  <span className="font-normal">
                    {" "}
                    (1000mg) - 3x Daily Empty Stomach
                  </span>
                </li>
                <li className="" style={{ listStyleType: "square" }}>
                  S.Boulardii -
                  <span className="font-normal">
                    {" "}
                    (250mg) - 2x Daily With Food
                  </span>
                </li>
              </ul>
            </div>
            {/* Protocol Body Content */}
            {!editedPost.edit && (
              <div>
                <p
                  className={`text-gray-900 mr-2.5 ${
                    showFullProtocol ? "" : "leading-6 max-h-24 overflow-hidden"
                  }`}
                >
                  {stripHtml(protocol.body)}
                </p>
                {!showFullProtocol && (
                  <div
                    className="mt-2.5 w-full text-right pr-7 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => {
                      setShowFullProtocol(true);
                    }}
                  >
                    show more....
                  </div>
                )}
                {showFullProtocol && (
                  <div
                    className="mt-2.5 w-full text-right pr-7 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => {
                      setShowFullProtocol(false);
                    }}
                  >
                    show less....
                  </div>
                )}
              </div>
            )}

            {/* PROTOCOL EDITING BOX */}
            {editedPost.edit && protocol.userId === session?.userId && (
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

            {/* PROTOCOLS OPTIONS BOX */}
            <div className="flex flex-row -mt-5 border-black pl-1">
              {/* SHARE PROTOCOL */}
              <FontAwesomeIcon
                size={"lg"}
                icon={faShare}
                className="cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                onClick={() => console.log("share?")}
              />
              <span className="hidden sm:inline-block ml-1.5 font-semibold text-purple-500 cursor-pointer">
                share
              </span>

              {/* PROTOCOL COMMENTS */}
              <FontAwesomeIcon
                size={"lg"}
                icon={faComment}
                className="ml-6 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                onClick={() => console.log("comment?")}
              />
              <span
                className="hidden sm:inline-block ml-1.5 font-semibold text-purple-500 cursor-pointer"
                onClick={() => {
                  if (protocol.comments?.length !== 0) {
                    setShowComments((state) => ({
                      ...state,
                      toggle: !showComments.toggle,
                    }));
                    // console.log(showComments.toggle);
                  }
                }}
              >
                {`${protocol.comments?.length || 0} ${
                  protocol.comments?.length === 1 ? "reply" : "replies"
                }`}
              </span>

              {/* EDIT PROTOCOL */}
              {/* {protocol.userId === session?.userId && (
                <span
                  onClick={() => {
                    setEditedPost((state) => ({
                      ...state,
                      edit: !editedPost.edit,
                    }));
                  }}
                >
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faPen}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  />
                  <span className="hidden sm:inline-block ml-1 font-semibold text-purple-500 cursor-pointer">
                    edit
                  </span>
                </span>
              )} */}

              {/* REPLY PROTOCOL */}
              {/* {session && (
                <span
                  onClick={() => {
                    setReplyPost((state) => ({
                      ...state,
                      reply: !replyPost.reply,
                    }));
                  }}
                >
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faReply}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  />
                  <span className="hidden sm:inline-block ml-1 font-semibold text-purple-500 cursor-pointer">
                    reply
                  </span>
                </span>
              )} */}

              {/* DELETE PROTOCOL */}
              {/* {protocol.userId === session?.userId && (
                <span onClick={handleDeletePost}>
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  />
                  <span className="hidden sm:inline-block ml-2 font-semibold text-purple-500 cursor-pointer">
                    delete
                  </span>
                </span>
              )} */}

              {/* SAVE EDIT PROTOCOL BUTTON */}
              {protocol.userId === session?.userId && editedPost.edit && (
                <span
                  className="ml-auto border-black"
                  onClick={(e) => handleEditPost(e)}
                >
                  {/* <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  /> */}
                  <span className="text-gray-800 font-semibold cursor-pointer bg-purple-300 rounded px-2.5 py-1.5 border ring-1 ring-gray-400 border-zinc-400">
                    Save
                  </span>
                </span>
              )}
            </div>

            {/* REPLY TO PROTOCOL BOX */}
            {replyPost.reply && protocol.userId === session?.userId && (
              <div>
                <div className="mx-0 my-4 mr-0 px-3 py-2 border border-gray-400 rounded">
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
              style={
                showComments.toggle ? { display: "block" } : { display: "none" }
              }
            >
              {protocol.comments
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
                      className="mx-3 mt-4 mb-4 last: mb-2 mr-12 px-3 py-2 border border-gray-400 rounded"
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
              <div className="text-right px-6 py-0 -mb-1.5">
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

export default Protocol;

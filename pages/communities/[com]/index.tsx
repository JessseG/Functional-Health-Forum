import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { Prisma, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import "moment-timezone";
import Post from "../../../components/post";
import Protocol from "../../../components/protocol";
import useSWR from "swr";
import { fetchData } from "../../../utils/utils";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { mutate } from "swr";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Select, { IndicatorSeparatorProps } from "react-select";
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
  faSort,
  faPlus,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

// A way of reformatting the props to be able to use Typescript features
type FullCom = Prisma.CommunityGetPayload<{
  include: {
    posts: { include: { user: true; community: true; votes: true } };
    comments: true;
    joinedUsers: { select: { email: true } };
    protocols: true;
  };
}>;

const Community = ({ fullCom: props }: { fullCom: FullCom }) => {
  // const Community = (props) => {
  const router = useRouter();
  const { com } = router.query;
  // const [session, loading] = useSession();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isNewPost, setIsNewPost] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [focus, setFocus] = useState("title");
  const [ringColor, setRingColor] = useState("ring-blue-300");
  const [sortByState, setSortByState] = useState("newest");
  const [postsOrProtocols, setPostsOrProtocols] = useState(true);
  const [newProtocol, setNewProtocol] = useState({ title: "", details: "" });
  const [protocolSubmitted, setProtocolSubmitted] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [reload, setReload] = useState(0);
  const [protocolProducts, setProtocolProducts] = useState([
    {
      name: "",
      dose: "",
      procedure: "",
    },
  ]);

  const comUrl = `/api/community/findCommunity/?name=${com}`;

  // If fullCom fails, error comes in
  const { data: fullCom, error } = useSWR(comUrl, fetchData, {
    fallbackData: props,
    // fallbackData: props.fullCom,
  });

  // console.log(fullCom);

  useEffect(() => {
    if (postsOrProtocols) {
      if (fullCom.posts.length === 0) {
        setIsNewPost(true);
      } else if (fullCom.posts.length > 0) {
        setIsNewPost(false);
      }
    } else if (!postsOrProtocols) {
      if (fullCom.protocols.length === 0) {
        setIsNewPost(true);
      } else if (fullCom.protocols.length > 0) {
        setIsNewPost(false);
      }
    }
  }, [
    fullCom?.name,
    postsOrProtocols,
    fullCom?.posts?.length,
    fullCom.protocols?.length,
  ]);

  const sortValuesBy = (list, sortBy) => {
    if (sortBy === "newest") {
      let sortedList = list.sort((a, b) => {
        let dateA = new Date(a.createdAt).getTime();
        let dateB = new Date(b.createdAt).getTime();
        return dateA > dateB ? 1 : dateA === dateB ? 0 : -1;
      });
      return sortedList.reverse();
    } else if (sortBy === "hottest") {
      let sortedList = list.sort((a, b) => {
        let votesA = a.votes.length;
        let votesB = b.votes.length;
        return votesA > votesB ? 1 : votesA === votesB ? 0 : -1;
      });
      return sortedList.reverse();
    }
  };

  // We need to get these from the Database
  const joined =
    fullCom.joinedUsers?.filter(
      (user: User) => user.email === session?.user.email
    ).length > 0;

  if (error || fullCom.posts === undefined) {
    if (error) {
      return (
        <Layout>
          <h1>{error.message}</h1>
        </Layout>
      );
    } else if (fullCom.posts === undefined) {
      return (
        <Layout>
          <h1>{fullCom.toString()}</h1>
        </Layout>
      );
    }
  }

  // This helps for focusing on the proper input box
  const focusWhere = (lastFocus) => {
    if (lastFocus === focus) {
      return true;
    } else return false;
  };

  const handleNewPost = async (e) => {
    e.preventDefault();

    // setPostSubmitted(true);
    // console.log("clicked");

    if (newPost.title === "" || newPost.content === "") {
      setRingColor("transition duration-700 ease-in-out ring-red-400");
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    setDisableClick(true);

    // create new post locally
    const title = newPost.title;

    const post = {
      title,
      body: newPost.content,
      community: com,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session?.userId,
        },
      ],
      user: session?.user,
    };

    // console.log(comUrl);
    // mutate (update local cache)
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          posts: [post, ...state.posts],
        };
      },
      false
    );

    // api request
    NProgress.start();
    await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: post }),
    }).then(() => {
      setDisableClick(false);
    });
    setNewPost({
      title: "",
      content: "",
    });
    setIsNewPost(false);
    NProgress.done();
    setRingColor("ring-blue-300");

    // validate & route back to our posts
    mutate(comUrl);

    // router.push(`/communities/${com}`);
  };

  const handleNewProtocol = async (e) => {
    e.preventDefault();

    setProtocolSubmitted(true);

    if (
      newProtocol.title === "" ||
      newProtocol.details === "" ||
      protocolProducts[0].name === "" ||
      protocolProducts[0].dose === "" ||
      protocolProducts[0].procedure === ""
    ) {
      setRingColor("transition duration-700 ease-in-out ring-red-400");
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    setDisableClick(true);

    const protocol = {
      title: newProtocol.title,
      body: newProtocol.details,
      community: com,
      products: protocolProducts,
      user: session?.user,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session?.userId,
        },
      ],
    };

    // console.log(comUrl);
    // mutate (update local cache);
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          protocols: [protocol, ...state.protocols],
        };
      },
      false
    );

    NProgress.start();
    await fetch("/api/protocols/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ protocol: protocol }),
    }).then(() => {
      setDisableClick(false);
    });
    setNewProtocol({
      title: "",
      details: "",
    });
    setProtocolProducts([
      {
        name: "",
        dose: "",
        procedure: "",
      },
    ]);
    setIsNewPost(false); // closes new protocol window
    NProgress.done();
    setRingColor("ring-blue-300");

    // validate & route back to our posts
    mutate(comUrl);
  };

  const handleJoinLeaveCom = async (e) => {
    e.preventDefault();

    // leave
    if (joined) {
      var joinedUsers = fullCom.joinedUsers.filter(
        (user) => user.email !== session.user.email
      );
    }
    // join
    else if (!joined) {
      var joinedUsers: any = [...fullCom.joinedUsers, session.user];
      // setReload(1);
    }

    // mutate (update local cache)
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          joinedUsers: joinedUsers,
        };
      },
      false
    );

    NProgress.start();
    if (joined) {
      await fetch("/api/users/leave-community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ com: fullCom.name }),
      });
    } else if (!joined) {
      await fetch("/api/users/join-community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ com: fullCom.name }),
      });
    }
    NProgress.done();

    // change Joined Button Color
    // mutate(comUrl);
  };

  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modal);
    console.log(modal);
  };

  const labelWithIconz = <FontAwesomeIcon size={"2x"} icon={faSort} />;

  const sortIcon = (
    <div className="w-6 h-6 bg-transparent">
      <Image
        layout="fill"
        className=""
        src="/images/sort-by-2.png"
        alt="sort by..."
      />
    </div>
  );

  const findPopularProtocol = () => {
    const popularProtocol = fullCom?.protocols.reduce((protocolA, protocolB) =>
      protocolA.votes.length > protocolB.votes.length ? protocolA : protocolB
    );

    return popularProtocol;
  };

  // console.log(fullCom.protocols);

  return (
    <Layout>
      {/* THIS RED IS THE BEST ONE */}
      <div className="bg-black border-black mx-auto flex flex-col flex-1 w-full">
        {/*  HEADER  */}
        <div className="border-black py-6 flex flex-col bg-slate-200 place-content-center flex-wrap">
          {/* OUTER CONTAINER */}
          <div
            className={`h-7/12 mt-1 px-6 flex flex-col container mx-auto items-start place-content-center 
                      w-full lg:w-9/12 lg:max-w-4xl border-red-400 ${
                        fullCom?.protocols?.length > 0
                          ? "xl:w-10/12 xl:max-w-full"
                          : ""
                      }`}
          >
            {/* INNER CONTAINER */}
            <div className="flex items-center w-full border-blue-400 justify-between">
              <div className="flex flex-row">
                <div className="text-2xl font-bold text-gray-700 border-black whitespace-pre">
                  {fullCom.displayName}
                </div>
                <button
                  className="ml-4 mt-1 max-h-8 text-sm font-semibold py-1 px-2.5 
                              rounded-md focus:outline-none bg-zinc-50 text-rose-500 border-gray-400 hover:bg-zinc-100 border"
                  onClick={(e) => {
                    handleJoinLeaveCom(e);
                  }}
                >
                  {joined ? "JOINED" : "JOIN"}
                </button>
              </div>
              <div className="border-b border-zinc-500 px-2 py-0.5 whitespace-pre">
                <div
                  className={`inline-block cursor-pointer ${
                    postsOrProtocols ? "text-rose-700" : "hover:scale-[0.96]"
                  }`}
                  onClick={() => setPostsOrProtocols(!postsOrProtocols)}
                >
                  Forum
                </div>
                <div className="inline-block border-l border-zinc-500 h-6 translate-y-1.5 mx-1.5"></div>
                <div
                  className={`inline-block cursor-pointer ${
                    postsOrProtocols
                      ? "black hover:scale-[0.96]"
                      : "text-rose-700"
                  }`}
                  onClick={() => setPostsOrProtocols(!postsOrProtocols)}
                >
                  Protocols
                </div>
              </div>
            </div>
            <p className="text-sm text-red-600">
              {`${
                fullCom.joinedUsers.length === 1
                  ? `${fullCom.joinedUsers.length} member`
                  : `${fullCom.joinedUsers.length} members`
              }`}
            </p>
            <div
              className="border-black flex flex-col container mx-auto mt-1 lg:mt-0 items-start place-content-center 
                        w-full h-1/3 text-sm+ leading-5 text-gray-600 overflow-hidden"
            >
              {fullCom.infoBoxText}
            </div>
          </div>
        </div>
        {/*  BODY  */}
        <div className="border-purple-500 pb-5 bg-gradient-to-b from-gray-800 to-red-300 flex flex-col flex-1">
          <div className="border-blue-400 xl:flex-row xl:flex container mx-auto py-4 pb-0 px-4 items-start place-content-center w-full lg:w-9/12 lg:max-w-4xl xl:w-10/12 xl:max-w-full">
            {/* Left Column (Posts) */}
            <div
              className={`border-black w-full ${
                fullCom?.protocols?.length === 0 ? "xl:w-17/24" : "xl:w-15/24+"
              }`}
            >
              <div className="">
                {postsOrProtocols && (
                  <button
                    onClick={() => {
                      setPostSubmitted(false);
                      setProtocolSubmitted(false);
                      setIsNewPost(!isNewPost);
                    }}
                    className="w-full py-3 inline-block font-semibold text-lg bg-slate-300 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                    // className="w-full py-3 inline-block font-semibold text-lg bg-slate-300 sm:bg-yellow-300 md:bg-yellow-600 lg:bg-red-500 xl:bg-purple-700 2xl:bg-blue-600 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                  >
                    Create Post
                  </button>
                )}
                {!postsOrProtocols && (
                  <button
                    onClick={() => {
                      setPostSubmitted(false);
                      setProtocolSubmitted(false);
                      setIsNewPost(!isNewPost);
                    }}
                    className="w-full py-3 inline-block font-semibold text-lg bg-slate-300 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                    // className="w-full py-3 inline-block font-semibold text-lg bg-white sm:bg-yellow-300 md:bg-yellow-600 lg:bg-red-500 xl:bg-purple-700 2xl:bg-blue-600 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                  >
                    Create Protocol
                  </button>
                )}
                {isNewPost && (
                  <div className="w-full bg-white rounded-md px-4 py-4 pb-2 mt-4">
                    <form>
                      <label className="block ml-4" />
                      {/*  New Post Title */}
                      {postsOrProtocols && (
                        <div className="mb-4 pt-0">
                          <input
                            autoFocus={focusWhere("title")}
                            onFocus={(e) => {
                              var val = e.target.value;
                              e.target.value = "";
                              e.target.value = val;
                              setFocus("title");
                            }}
                            type="text"
                            placeholder="Title"
                            value={newPost.title}
                            onChange={(e) =>
                              setNewPost((state) => ({
                                ...state,
                                title: e.target.value,
                              }))
                            }
                            className={`autoFocus px-4 py-3 placeholder-gray-400 text-black relative ${
                              newPost.title === "" && postSubmitted
                                ? `${ringColor}`
                                : ""
                            } ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
                          />
                        </div>
                      )}
                      {/* New Protocol Title */}
                      {!postsOrProtocols && (
                        <div className="mb-4 pt-0">
                          <input
                            autoFocus={focusWhere("title")}
                            onFocus={(e) => {
                              var val = e.target.value;
                              e.target.value = "";
                              e.target.value = val;
                              setFocus("title");
                            }}
                            type="text"
                            placeholder="Protocol Title"
                            value={newProtocol.title}
                            onChange={(e) =>
                              setNewProtocol((state) => ({
                                ...state,
                                title: e.target.value,
                              }))
                            }
                            className={`autoFocus px-4 py-3 placeholder-gray-400 text-black relative ${
                              newProtocol.title === "" && protocolSubmitted
                                ? `${ringColor}`
                                : ""
                            } ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
                          />
                        </div>
                      )}
                      {/* ADD NEW PROTOCOL */}
                      {!postsOrProtocols && (
                        <div className="ml-1 mb-2.5">
                          <div className="flex items-center mb-2 border-black">
                            <div className="ml-1 font-semibold border-black text-base+">{`Products ${" "}`}</div>
                            {/* ADDS NEW PRODUCT TO PROTOCOL */}
                            <FontAwesomeIcon
                              icon={faPlusSquare}
                              className={`cursor-pointer ml-3 faPlus border-none text-emerald-400 hover:text-amber-800`}
                              type="button"
                              onClick={() => {
                                if (
                                  protocolProducts.length < 6 &&
                                  protocolProducts[protocolProducts.length - 1]
                                    ?.name
                                ) {
                                  const protoProducts = [
                                    ...protocolProducts,
                                    {
                                      name: "",
                                      dose: "",
                                      procedure: "",
                                    },
                                  ];
                                  setProtocolProducts(protoProducts);
                                }
                              }}
                            />
                          </div>
                          {protocolProducts.map((product, key) => {
                            return (
                              <div
                                className="w-full mb-3.5 inline-flex items-center"
                                key={key}
                              >
                                <div
                                  className={`w-full rounded-sm items-center justify-between inline-flex border-red-600 ring-1 ${
                                    (product.name === "" ||
                                      product.dose === "" ||
                                      product.procedure === "") &&
                                    protocolSubmitted
                                      ? `${ringColor}`
                                      : ``
                                  }`}
                                >
                                  <input
                                    type="text"
                                    className={`px-2.5 py-1.5 rounded-l-sm text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
                                      (product.name === "" ||
                                        product.dose === "" ||
                                        product.procedure === "") &&
                                      protocolSubmitted
                                        ? `${ringColor}`
                                        : ``
                                    } bg-white border-0 shadow-md outline-none focus:outline-none w-1/3`}
                                    placeholder="Name"
                                    value={product.name}
                                    onChange={(e) => {
                                      const protoProducts = [
                                        ...protocolProducts,
                                      ];
                                      protoProducts[key].name = e.target.value;
                                      setProtocolProducts(protoProducts);
                                    }}
                                  />
                                  <input
                                    type="text"
                                    className={`px-2.5 py-1.5 text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
                                      (product.name === "" ||
                                        product.dose === "" ||
                                        product.procedure === "") &&
                                      protocolSubmitted
                                        ? `${ringColor}`
                                        : ``
                                    } bg-white border-0 shadow-md outline-none focus:outline-none w-5/24`}
                                    placeholder="Dose"
                                    value={product.dose}
                                    onChange={(e) => {
                                      const protoProducts = [
                                        ...protocolProducts,
                                      ];
                                      protoProducts[key].dose = e.target.value;
                                      setProtocolProducts(protoProducts);
                                    }}
                                  />
                                  <input
                                    type="text"
                                    className={`px-2.5 py-1.5 rounded-r-sm text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
                                      (product.name === "" ||
                                        product.dose === "" ||
                                        product.procedure === "") &&
                                      protocolSubmitted
                                        ? `${ringColor}`
                                        : ``
                                    } bg-white border-0 shadow-md outline-none focus:outline-none w-11/24`}
                                    placeholder="Procedure"
                                    value={product.procedure}
                                    onChange={(e) => {
                                      const protoProducts = [
                                        ...protocolProducts,
                                      ];
                                      protoProducts[key].procedure =
                                        e.target.value;
                                      setProtocolProducts(protoProducts);
                                    }}
                                  />
                                </div>
                                {/* DELETE PROTOCOL PRODUCT */}
                                <FontAwesomeIcon
                                  size={"lg"}
                                  icon={faTrash}
                                  onClick={() => {
                                    if (protocolProducts.length > 1) {
                                      const protoProducts = [
                                        ...protocolProducts,
                                      ];
                                      protoProducts.splice(key, 1);
                                      setProtocolProducts(protoProducts);
                                    }
                                    if (
                                      key === 0 &&
                                      protocolProducts.length === 1
                                    ) {
                                      const protoProducts = [
                                        ...protocolProducts,
                                      ];
                                      protoProducts[0].name = "";
                                      protoProducts[0].dose = "";
                                      protoProducts[0].procedure = "";
                                      setProtocolProducts(protoProducts);
                                    }
                                  }}
                                  className="ml-3.5 mr-1.5 cursor-pointer text-gray-600 hover:text-red-500 invert-25 hover:invert-0"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/*  New Protocol Content */}
                      {!postsOrProtocols && (
                        <div
                          className={`mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-2 ${
                            newProtocol.details === "" && protocolSubmitted
                              ? `${ringColor}`
                              : ``
                          }`}
                        >
                          <TextareaAutosize
                            autoFocus={focusWhere("content")}
                            onFocus={(e) => {
                              var val = e.target.value;
                              e.target.value = "";
                              e.target.value = val;
                              setFocus("content");
                            }}
                            minRows={4}
                            className="form-textarea min-h-min text-gray-600 block w-full px-3 py-1 outline-none overflow-hidden"
                            placeholder="Details"
                            value={newProtocol.details}
                            onChange={(e) =>
                              setNewProtocol((state) => ({
                                ...state,
                                details: e.target.value,
                              }))
                            }
                          />
                        </div>
                      )}

                      {/*  New Post Content */}
                      {postsOrProtocols && (
                        <div
                          className={`mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-2 ${
                            newPost.content === "" && postSubmitted
                              ? `${ringColor}`
                              : ``
                          }`}
                        >
                          <TextareaAutosize
                            autoFocus={focusWhere("content")}
                            onFocus={(e) => {
                              var val = e.target.value;
                              e.target.value = "";
                              e.target.value = val;
                              setFocus("content");
                            }}
                            minRows={4}
                            className="form-textarea min-h-min text-gray-600 block w-full px-3 py-1 outline-none overflow-hidden"
                            placeholder="Content"
                            value={newPost.content}
                            onChange={(e) =>
                              setNewPost((state) => ({
                                ...state,
                                content: e.target.value,
                              }))
                            }
                          />
                        </div>
                      )}
                      <div className="mt-2.5 pr-0.5 flex justify-end">
                        <button
                          disabled={disableClick}
                          className="border-2 text-black bg-indigo-200 text-base font-medium border-gray-300 rounded-md px-3.5 py-1 outline-none"
                          onClick={(e) => {
                            if (postsOrProtocols) {
                              handleNewPost(e);
                            } else if (!postsOrProtocols) {
                              handleNewProtocol(e);
                            }
                          }}
                          type="submit"
                        >
                          Submit
                        </button>
                        <button
                          className="ml-2 border-2 text-black bg-yellow-300 text-base font-medium border-gray-300 rounded-md px-2.5 py-1 outline-none"
                          onClick={(e) => {
                            e.preventDefault();
                            setPostSubmitted(false);
                            setProtocolSubmitted(false);
                            setIsNewPost(!isNewPost);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="border-green-400">
                {postsOrProtocols &&
                  sortByState === "newest" &&
                  sortValuesBy(fullCom?.posts, sortByState).map(
                    (post, index) => (
                      <Post
                        key={index}
                        post={post}
                        comUrl={comUrl}
                        fullCom={fullCom}
                        modal={handleModal}
                      />
                    )
                  )}
                {postsOrProtocols &&
                  sortByState === "hottest" &&
                  sortValuesBy(fullCom?.posts, sortByState).map(
                    (post, index) => (
                      <Post
                        key={index}
                        post={post}
                        comUrl={comUrl}
                        fullCom={fullCom}
                        modal={handleModal}
                      />
                    )
                  )}
                {!postsOrProtocols &&
                  sortByState === "newest" &&
                  sortValuesBy(fullCom?.protocols, sortByState).map(
                    (protocol, index) => (
                      <Protocol
                        key={index}
                        protocol={protocol}
                        comUrl={comUrl}
                        fullCom={fullCom}
                        modal={handleModal}
                        editable={true}
                      />
                    )
                  )}
                {!postsOrProtocols &&
                  sortByState === "hottest" &&
                  sortValuesBy(fullCom?.protocols, sortByState).map(
                    (protocol, index) => (
                      <Protocol
                        key={index}
                        protocol={protocol}
                        comUrl={comUrl}
                        fullCom={fullCom}
                        modal={handleModal}
                        editable={true}
                      />
                    )
                  )}
              </div>
            </div>

            {/* >Right Column (sidebar) */}
            {fullCom?.protocols?.length > 0 && (
              <div
                className={`border-2 border-red-500 w-full xl:w-9/24- xl:ml-4 hidden xl:block mb-4 xl:mb-0 
                        bg-white rounded-md ${postsOrProtocols ? "" : ""}`}
              >
                <div className="bg-violet-200 p-4 rounded-t-md">
                  <p className="text-lg- text-gray-900 font-semibold ml-3">
                    Top Rated Protocol
                  </p>
                </div>

                {/* EACH PROTOCOL */}
                <div className="border-zinc-400 -mt-3">
                  {/* VOTE ICONS */}
                  {/* <div className="border-red-400 flex flex-col min-w-2/32 max-w-2/32 mx-4 sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-3 items-center">
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faHandPointUp}
                    className={`cursor-pointer text-gray-600 hover:text-red-500`}
                    onClick={() => console.log("Upvoted Protocol?")}
                  />
                  <p className="text-base text-center my-1 mx-1.5">{0}</p>
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faHandPointDown}
                    className={`cursor-pointer text-gray-600 hover:text-blue-500`}
                    onClick={() => console.log("Downvoted Protocol?")}
                  />
                  </div> */}
                  {/* {postsOrProtocols &&
                fullCom.Protocol.map((protocol) => {
                  return protocol.body;
                })} */}

                  <div className="border-black">
                    <Protocol
                      key={0}
                      protocol={findPopularProtocol()}
                      comUrl={comUrl}
                      fullCom={fullCom}
                      modal={handleModal}
                      editable={false}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* >Right Column (sidebar) */}
            {/* <div className="w-full lg:w-5/12 lg:ml-4 lg:block mb-4 lg:mb-0 bg-white rounded-md hidden">
              <div className="bg-indigo-200 p-4 rounded-t-md">
                <p className="text-base text-gray-900 font-semibold ml-1.5">
                  About
                </p>
              </div>
              <div className="px-5 py-2">
                <p className="">{fullCom.infoBoxText}</p>
                <div className="flex w-full my-3 font-semibold px-2">
                  <div className="w-full">
                    <p>{fullCom.joinedUsers.length}</p>
                    <p className="text-sm">Members</p>
                  </div>
                  <div className="w-full">
                    <p>{fullCom.posts.length}</p>
                    <p className="text-sm">Posts</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-300 my-4" />
                <p className="text-md mb-4 px-2">
                  <b>Created -</b>{" "}
                  <Moment format="LL">{fullCom.createdAt}</Moment>
                </p>
                <button className="focus:outline-none hidden lg:block rounded-md w-full py-2 my-1 text-gray-900 font-semibold bg-yellow-400 border border-gray-400">
                  CREATE POST
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  /* 
      The 'com' in (ctx.query.com) refers to the {com} object returned by 
      the handler function in 'findCommunity.ts', containing the set of 
      data for the particular community requested.
  */
  const url = `${process.env.NEXTAUTH_URL}/api/community/findCommunity/?name=${ctx.query.com}`;

  const fullCom = await fetchData(url);
  // console.log(fullCom);
  // This 'fullCom' contains all the contents of the selected community

  return {
    props: {
      fullCom,
    },
  };
}

export default Community;

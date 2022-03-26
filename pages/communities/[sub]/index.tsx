import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { Prisma, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import "moment-timezone";
import Post from "../../../components/post";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

// A way of reformatting the props to be able to use Typescript features
// type SubWithPosts = Prisma.SubredditGetPayload<{
//   include: {
//     posts: { include: { user: true; subreddit: true } };
//     joinedUsers: true;
//   };
// }>;

// const SubReddit = ({ fullSub }: { fullSub: SubWithPosts }) => {

const SubReddit = (props) => {
  const router = useRouter();
  const { sub } = router.query;
  // const [session, loading] = useSession();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isNewPost, setIsNewPost] = useState(false);
  const [newPost, setnewPost] = useState({ title: "", content: "" });
  const [focus, setFocus] = useState("title");
  const [ringColor, setRingColor] = useState("ring-blue-300");
  const [sortBy, setSortBy] = useState("newest");
  const [forumProtocol, setForumProtocol] = useState(true);

  const subUrl = `/api/subreddit/findSubreddit/?name=${sub}`;

  const { data: fullSub, error } = useSWR(subUrl, fetchData, {
    fallbackData: props.fullSub,
  });

  // We need to get these from the Database
  const joined =
    fullSub.joinedUsers?.filter(
      (user: User) => user.name === session?.user.name
    ).length > 0;

  if (error) {
    return (
      <Layout>
        <h1>{error.message}</h1>
      </Layout>
    );
  }

  const focusWhere = (lastFocus) => {
    if (lastFocus === focus) {
      return true;
    } else return false;
  };

  const handleNewPost = async (e) => {
    e.preventDefault();

    if (!newPost.title) {
      setRingColor("transition duration-700 ease-in-out ring-red-400");
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    // create new post locally
    const title = newPost.title;

    const post = {
      title,
      body: newPost.content,
      subReddit: sub,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session?.userId,
        },
      ],
      user: session?.user,
    };

    // console.log(subUrl);
    // mutate (update local cache)
    mutate(
      subUrl,
      async (state) => {
        return {
          ...state,
          posts: [...state.posts, post],
        };
      },
      false
    );

    // mutate(
    //   subUrl,
    //   async (state) => ({
    //     ...state,
    //     posts: [...state.posts, post],
    //   }),
    //   false
    // );

    // api request
    NProgress.start();
    await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: post }),
    });
    setnewPost({
      title: "",
      content: "",
    });
    setIsNewPost(false);
    NProgress.done();
    setRingColor("ring-blue-300");

    // validate & route back to our posts
    mutate(subUrl);

    // router.push(`/communities/${sub}`);
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

  const indicatorSeparatorStyle = {
    display: "none",
    marginLeft: "-1rem",
  };

  const IndicatorSeparator = () => {
    return <span style={indicatorSeparatorStyle} />;
  };

  // console.log(fullSub.Protocol);

  return (
    <Layout>
      {/* THIS RED IS THE BEST ONE */}
      <div className="bg-black border-black mx-auto flex flex-col flex-1 w-full">
        {/*  HEADER  */}
        <div className="border-3 py-6 flex flex-col bg-slate-200 place-content-center flex-wrap">
          {/* OUTER CONTAINER */}
          <div
            className="h-7/12 mt-1 px-4 flex flex-col container mx-auto items-start place-content-center 
                      w-full lg:w-10/12 border-red-400"
          >
            {/* INNER CONTAINER */}
            <div className="flex items-center w-full border-blue-400 justify-between">
              <div className="flex flex-row">
                <div className="text-2xl font-bold text-gray-700 border-black whitespace-pre">
                  {fullSub.displayName}
                </div>
                <button
                  className="ml-4 mt-1 max-h-8 text-sm text-green-400 font-semibold py-1 px-3 
                              rounded-md focus:outline-none border border-green-400"
                >
                  {joined ? "JOINED" : "JOIN"}
                </button>
              </div>
              <div className="border-b border-zinc-500 px-2 py-0.5 whitespace-pre">
                <div
                  className={`inline-block cursor-pointer hover:text-sky-700 ${
                    forumProtocol ? "text-sky-700" : ""
                  }`}
                  onClick={() => setForumProtocol(!forumProtocol)}
                >
                  Forum
                </div>
                <div className="inline-block border-l border-zinc-500 h-6 translate-y-1.5 mx-1.5"></div>
                <div
                  className={`inline-block cursor-pointer hover:text-sky-700 ${
                    forumProtocol ? "black" : "text-sky-700"
                  }`}
                  onClick={() => setForumProtocol(!forumProtocol)}
                >
                  Protocols
                </div>
              </div>
            </div>
            <p className="text-sm text-red-600">r/{sub}</p>
            {/* <p className="text-sm text-red-600">Bacterium</p> */}
          </div>
          <div
            className="flex flex-col container mx-auto mt-1 lg:mt-0 px-4 items-start place-content-center 
                        w-full lg:w-10/12 h-1/3 text-sm+ leading-5 text-gray-600 overflow-hidden"
          >
            {fullSub.infoBoxText}
          </div>
        </div>
        {/*  BODY  */}
        <div className="border-purple-500 pb-3 bg-gradient-to-b from-gray-800 to-red-300 flex flex-col flex-1">
          <div className="border-blue-400 lg:flex-row lg:flex container mx-auto py-4 pb-0 px-4 items-start place-content-center w-full lg:w-10/12">
            {/* Left Column (Posts) */}
            <div className="border-black w-full lg:w-7/12">
              <div className="">
                <button
                  onClick={() => setIsNewPost(!isNewPost)}
                  className="w-full py-3 inline-block font-semibold text-lg bg-slate-300 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                  // className="w-full py-3 font-semibold text-lg bg-white sm:bg-yellow-300 md:bg-yellow-600 lg:bg-red-500 xl:bg-purple-700 2xl:bg-blue-600 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none"
                >
                  Create Post
                </button>
                {isNewPost && (
                  <div className="w-full bg-white rounded-md px-4 py-4 pb-2 mt-4">
                    <form onSubmit={handleNewPost}>
                      <label className="block ml-4" />
                      <div className="mb-3 pt-0">
                        {/*  New Post Title */}
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
                            setnewPost((state) => ({
                              ...state,
                              title: e.target.value,
                            }))
                          }
                          className={`autoFocus px-4 py-3 placeholder-gray-400 text-black relative ${ringColor} ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
                        />
                      </div>
                      <div className="mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-gray-300 ring-2">
                        {/*  New Post Content */}
                        <TextareaAutosize
                          autoFocus={focusWhere("content")}
                          onFocus={(e) => {
                            var val = e.target.value;
                            e.target.value = "";
                            e.target.value = val;
                            setFocus("content");
                          }}
                          minRows={4}
                          className="form-textarea text-gray-600 block w-full px-3 py-1 outline-none overflow-hidden"
                          placeholder="Content"
                          value={newPost.content}
                          onChange={(e) =>
                            setnewPost((state) => ({
                              ...state,
                              content: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="mt-2.5 pr-0.5 flex justify-end">
                        <button
                          className="border-2 text-black bg-indigo-200 text-lg font-semibold border-gray-300 rounded-md px-3.5 py-1 outline-none"
                          type="submit"
                        >
                          Submit
                        </button>
                        <button
                          className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-1 outline-none"
                          onClick={(e) => {
                            e.preventDefault();
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
                {sortBy === "newest" &&
                  fullSub?.posts
                    .slice(0)
                    // .sort((a,b) => a.createdAt - b.createdAt)
                    .reverse()
                    .map((post, index) => (
                      <Post
                        key={index}
                        post={post}
                        subUrl={subUrl}
                        fullSub={fullSub}
                        modal={handleModal}
                      />
                    ))}
                {sortBy === "hottest" &&
                  fullSub.posts.map((post, index) => (
                    <Post
                      key={index}
                      post={post}
                      subUrl={subUrl}
                      fullSub={fullSub}
                      modal={handleModal}
                    />
                  ))}
              </div>
            </div>
            {/* >Right Column (sidebar) */}
            <div className="border-2 border-red-400 w-full lg:w-5/12 lg:ml-4 hidden lg:block mb-4 lg:mb-0 bg-white rounded-md">
              <div className="bg-slate-300 p-4 rounded-t-md">
                <p className="text-base+ text-gray-900 font-semibold ml-2.5">
                  Popular Protocols
                </p>
              </div>

              {/* EACH PROTOCOL */}
              <div className="my-2 px-2 py-2 pb-4 flex border-zinc-400 border-b">
                {/* VOTE ICONS */}
                <div className="border-red-400 flex flex-col inline-block min-w-2/32 max-w-2/32 mx-4 sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-3 items-center">
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
                </div>

                {/* PROTOCOL CHECKLIST */}
                <div className="border-red-400">
                  <ul className="ml-7 font-semibold">
                    <li className="" style={{ listStyleType: "square" }}>
                      Berberine HCL -
                      <span className="font-normal">
                        {" "}
                        (800mg 3x Daily pre-Mastic Gum)
                      </span>
                    </li>
                    <li className="" style={{ listStyleType: "square" }}>
                      Mastic Gum -
                      <span className="font-normal">
                        {" "}
                        (1000mg 3x Daily Empty Stomach)
                      </span>
                    </li>
                    <li className="" style={{ listStyleType: "square" }}>
                      S.Boulardii -
                      <span className="font-normal">
                        {" "}
                        (250mg 2x Daily With Food)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              {fullSub.Protocol.map((protocol) => {
                return protocol.body;
              })}
            </div>
            {/* >Right Column (sidebar) */}
            {/* <div className="w-full lg:w-5/12 lg:ml-4 lg:block mb-4 lg:mb-0 bg-white rounded-md hidden">
              <div className="bg-indigo-200 p-4 rounded-t-md">
                <p className="text-base text-gray-900 font-semibold ml-1.5">
                  About
                </p>
              </div>
              <div className="px-5 py-2">
                <p className="">{fullSub.infoBoxText}</p>
                <div className="flex w-full my-3 font-semibold px-2">
                  <div className="w-full">
                    <p>{fullSub.joinedUsers.length}</p>
                    <p className="text-sm">Members</p>
                  </div>
                  <div className="w-full">
                    <p>{fullSub.posts.length}</p>
                    <p className="text-sm">Posts</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-300 my-4" />
                <p className="text-md mb-4 px-2">
                  <b>Created -</b>{" "}
                  <Moment format="LL">{fullSub.createdAt}</Moment>
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
      The 'sub' in (ctx.query.sub) refers to the {sub} object returned by 
      the handler function in 'findSubreddit.ts', containing the set of 
      data for the particular subreddit requested.
  */
  const url = `${process.env.NEXTAUTH_URL}/api/subreddit/findSubreddit/?name=${ctx.query.sub}`;

  const fullSub = await fetchData(url);
  // console.log(fullSub);
  // This 'fullSub' contains all the contents of the selected subreddit

  return {
    props: {
      fullSub,
    },
  };
}

export default SubReddit;

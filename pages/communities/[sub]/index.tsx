import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { Prisma, User } from "@prisma/client";
import { useSession } from "next-auth/client";
import Moment from "react-moment";
import "moment-timezone";
import Post from "../../../components/posts";
import useSWR from "swr";
import { fetchData } from "../../../utils/utils";

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
  const [session, loading] = useSession();

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

  return (
    <Layout>
      {/*  HEADER  */}
      <div className="h-32 lg:h-28 bg-indigo-100 flex flex-col place-content-center">
        <div
          className="h-7/12 mt-1 px-4 flex flex-col container mx-auto items-start place-content-center 
                      w-full lg:w-10/12"
        >
          {/* <div className="w-16 absolute h-16 bottom-3 rounded-full bg-purple-300 border-white border-2" /> */}

          <div className="flex items-center">
            <h4 className="text-2xl font-bold text-gray-700">
              {fullSub.displayName}
            </h4>
            <button
              className="ml-4 text-sm text-green-400 font-semibold py-1 px-3 
                              rounded-md focus:outline-none border border-green-400"
            >
              {joined ? "JOINED" : "JOIN"}
            </button>
          </div>
          <p className="text-sm text-red-600">r/{sub}</p>
        </div>
        <div
          className="flex flex-col container mx-auto mt-1 lg:mt-0 px-4 items-start place-content-center 
        w-full lg:w-10/12 h-1/3 text-sm+ leading-5 text-gray-600 overflow-hidden"
        >
          {fullSub.infoBoxText}
        </div>
      </div>
      {/*  BODY  */}
      <div className="bg-gradient-to-b from-purple-400 to-white">
        <div className="flex-col lg:flex-row lg:flex container mx-auto py-4 px-4 items-start place-content-center w-full lg:w-10/12">
          {/* Left Column (Posts) */}
          <div className="w-full lg:w-2/3">
            <Link href={`/communities/${sub}/submit`}>
              <a className="block w-full text-center py-3 font-semibold text-lg bg-white rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none">
                Create Post
                {/* <button className="w-full py-3 font-semibold text-lg bg-white sm:bg-yellow-300 md:bg-yellow-600 lg:bg-red-500 xl:bg-purple-700 2xl:bg-blue-600 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none">              Create Post */}
              </a>
            </Link>
            {fullSub.posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                subUrl={subUrl}
                fullSub={fullSub}
              />
            ))}
          </div>
          {/* >Right Column (sidebar) */}
          <div className="w-full lg:w-1/3 lg:ml-4 lg:block mb-4 lg:mb-0 bg-white rounded-md hidden">
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

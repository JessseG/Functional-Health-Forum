import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Prisma } from "@prisma/client";

// A way of reformatting the props to be able to use Typescript features
type SubWithPosts = Prisma.SubredditGetPayload<{
  include: { posts: { include: { user: true; subreddit: true } } };
}>;

const SubReddit = ({ fullSub }: { fullSub: SubWithPosts }) => {
  const router = useRouter();
  const { sub } = router.query;

  console.log(fullSub);

  // We need to get these from the Database
  const joined = true;
  // const displayName = sub;
  const about = "Next.js is the React Framework by Vercel";
  const members = 4100; // create helper function to transform to 4.1k
  const totalPosts = 203;
  const created = new Date();
  const dateOptions = {
    // formatting the Date
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  return (
    <Layout>
      <div className="h-16 bg-green-400" />
      <div className="h-18 bg-white">
        <div className="mx-auto container px-12 py-2 flex relative flex-col">
          <div className="w-16 absolute h-16 bottom-6 rounded-full bg-green-400 border-white border-2" />
          <div className="flex items-center">
            <h4 className="ml-20 text-2xl font-bold text-gray-700">
              {fullSub.displayName}
            </h4>
            <button className="ml-4 text-sm text-green-400 font-semibold border border-green-400 py-1 px-3 rounded-md focus:outline-none">
              {joined ? "JOINED" : "JOIN"}
            </button>
          </div>
          <p className="ml-20 text-sm text-red-600">r/{sub}</p>
        </div>
      </div>
      <div className="bg-gray-300">
        <div className="flex container mx-auto py-4 px-4">
          {/* Left Column (Posts) */}
          <div className="w-2/3">
            <button className="w-full py-2 bg-white rounded-md shadow-sm hover:shadow-lg outline-none focus:outline-none">
              Create Post
            </button>
            <div className="w-full bg-white rounded-md p-4 mt-4">
              <div className="flex">
                <div className="flex flex-col">
                  <p>Upvote</p>
                  <p>Count</p>
                  <p>Downvote</p>
                </div>
                <div>
                  <p>Posted by username</p>
                  <p>Post Title</p>
                  <p>Posted Preview</p>
                  <div>
                    <p>
                      {/* comment icon */} {/* comment count */} comments
                    </p>
                    <p>Share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* >Right Column (sidebar) */}
          <div className="w-1/3 ml-4 bg-white rounded-md">
            <div className="bg-green-400 py-4 px-2 rounded-t-md">
              <p className="text-sm text-gray-900 font-bold">About Community</p>
            </div>
            <div className="p-2">
              <p>{fullSub.infoBoxText}</p>
              <div className="flex w-full mt-2 font-semibold">
                <div className="w-full">
                  <p>4.1k</p>
                  <p className="text-sm">Members</p>
                </div>
                <div className="w-full">
                  <p>19</p>
                  <p className="text-sm">Online</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-300 my-4" />
              <p className="text-md mb-4">
                <b>Created -</b>{" "}
                {created.toLocaleDateString("en-US", dateOptions)}
              </p>
              <button className="focus:outline-none rounded-md w-full py-1 text-gray-900 font-semibold bg-green-400">
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
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/subreddit/findSubreddit?name=${ctx.query.sub}`
  );

  const fullSub = await res.json();
  // console.log(fullSub);
  // This 'fullSub' contains all the contents of the selected subreddit

  return {
    props: {
      fullSub,
    },
  };
}

export default SubReddit;

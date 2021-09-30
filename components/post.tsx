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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetchDedupe } from "fetch-dedupe";
import "react-quill/dist/quill.snow.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

type FullPost = Prisma.PostGetPayload<{
  include: { user: true; subreddit: true; votes: true };
}>;

type SubWithPosts = Prisma.SubredditGetPayload<{
  include: {
    posts: { include: { user: true; subreddit: true; votes: true } };
    joinedUsers: true;
  };
}>;

interface Props {
  post: FullPost;
  subUrl: string;
  fullSub: SubWithPosts;
}

const Post = ({ post, subUrl, fullSub }: Props) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { sub } = router.query;

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
          subUrl,
          async (state = fullSub) => {
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
          subUrl,
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
        subUrl,
        async (state = fullSub) => {
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
    mutate(subUrl);
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();

    // mutate (update local cache)
    mutate(
      subUrl,
      async (state) => {
        return {
          ...state,
          posts: state.posts.filter(
            (currentPost) =>
              currentPost.id !== post.id &&
              currentPost.userId === session?.userId
          ),
        };
      },
      false
    );

    // console.log(subUrl);

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
    mutate(subUrl);

    // router.push(`/communities/${sub}`);
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

  return (
    <div className="w-full bg-white rounded-md py-3.5 pr-3 mt-4">
      <div className="flex">
        <div className="flex flex-col min-w-2/32 max-w-2/32 mx-4 sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-2.5 items-center">
          <FontAwesomeIcon
            size={"2x"}
            icon={faCaretUp}
            className={`${
              hasVoted?.voteType === "UPVOTE" ? "text-red-500" : "text-gray-600"
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
        <div className="w-full">
          <p className="text-sm text-gray-500">Posted by {post.user.name}</p>
          <p className="text-xl font-semibold text-gray-850 my-1.5">
            {post.title}
          </p>
          <p className="text-gray-900 mr-3">{stripHtml(post.body)}</p>
          {/* <ReactQuill
            className="inherit"
            value={post.body}
            readOnly={true}
            theme={"snow"}
            modules={{ toolbar: false }}
          /> */}
          <div className="flex flex-row mt-3">
            {post.userId === session?.userId && (
              <FontAwesomeIcon
                size={"lg"}
                icon={faShare}
                className="cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                onClick={() => votePost("UPVOTE")}
              />
            )}
            <span className="ml-1.5 font-semibold text-purple-500 cursor-pointer">
              share
            </span>
            <FontAwesomeIcon
              size={"lg"}
              icon={faComment}
              className="ml-6 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
              onClick={() => votePost("UPVOTE")}
            />
            <span className="ml-1.5 font-semibold text-purple-500 cursor-pointer">
              {/* comment icon */} {/* comment count */} comments
            </span>
            {post.userId === session?.userId && (
              <span>
                <FontAwesomeIcon
                  size={"lg"}
                  icon={faPen}
                  className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  onClick={() => votePost("UPVOTE")}
                />
                <span className="ml-1 font-semibold text-purple-500 cursor-pointer">
                  edit
                </span>
              </span>
            )}
            {/* {post.userId === session?.userId && (
              <span className="ml-1 font-semibold text-purple-500 cursor-pointer">
                edit
              </span>
            )} */}
            {post.userId === session?.userId && (
              <span onClick={handleDeletePost}>
                <FontAwesomeIcon
                  size={"lg"}
                  icon={faTrash}
                  className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                />
                <span className="ml-2 font-semibold text-purple-500 cursor-pointer">
                  delete
                </span>
              </span>
            )}
            {/* {post.userId === session?.userId && (
              <p className="ml-2 font-semibold text-purple-500 border border-black cursor-pointer">
                delete
              </p>
            )} */}
          </div>
          {/* <div className="flex flex-col mt-2">
            <p>Post.user.id: {post.user.id}</p>
            <p>Post.userId: {post.userId}</p>
            <p>Session id: {session.userId}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Post;

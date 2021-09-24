import { Prisma } from "@prisma/client";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetchDedupe } from "fetch-dedupe";

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

    await fetchDedupe("/api/post/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id, type }),
    });

    // revalidates the cache change from database
    mutate(subUrl);
  };

  const calculateVoteCount = (votes) => {
    const upvotes = votes.filter((vote) => vote.voteType === "UPVOTE");
    const downvotes = votes.filter((vote) => vote.voteType === "DOWNVOTE");

    const voteCount = upvotes.length - downvotes.length;
    return voteCount;
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
          <p className="text-gray-900">{post.body}</p>
          <div>
            <p>
              {/* comment icon */} {/* comment count */} comments
            </p>
            <p className="font-semibold text-green-700">Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

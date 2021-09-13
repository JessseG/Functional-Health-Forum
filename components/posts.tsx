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

type FullPost = Prisma.PostGetPayload<{
  include: { user: true; subreddit: true };
}>;

const Post = ({ post }: { post: FullPost }) => {
  return (
    <div className="w-full bg-white rounded-md p-4 mt-4">
      <div className="flex">
        <div className="flex flex-col mx-2 items-center">
          <FontAwesomeIcon
            size={"2x"}
            icon={faCaretUp}
            className="cursor-pointer text-gray-600 hover:text-red-500"
          ></FontAwesomeIcon>
          <p className="text-base mx-1.5">4</p>
          <FontAwesomeIcon
            size={"2x"}
            icon={faCaretDown}
            className="cursor-pointer text-gray-600 hover:text-red-500"
          ></FontAwesomeIcon>
        </div>
        <div className="mx-3">
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

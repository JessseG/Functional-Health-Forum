import prisma from "../../../db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const { postId } = req.body;
  const session = await getSession({ req });

  const id = postId;
  // console.log(postId);

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  try {
    const deletePost = await prisma.post.delete({
      where: { id },
    });

    if (!deletePost) {
      return res.status(500).json({ error: "Post no longer exits" });
    }
    return res.json(deletePost);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

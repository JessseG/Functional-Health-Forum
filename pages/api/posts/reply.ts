import prisma from "../../../db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const { reply } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }
  // console.log(reply.community);
  try {
    const newReply = await prisma.post_Comment.create({
      data: {
        body: reply.body,
        // post: reply.post,
        post: { connect: { id: reply.post.id } },
        community: {
          connect: {
            name: reply.community,
          },
        },
        user: {
          connect: {
            id: String(session.userId),
          },
        },
        votes: {
          create: {
            post: { connect: { id: reply.post.id } },
            user: { connect: { id: String(session.userId)}},
            voteType: "UPVOTE",
          },
        },
      },
    });

    return res.json(newReply);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

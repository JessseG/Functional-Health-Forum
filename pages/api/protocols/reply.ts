import prisma from "../../../db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const { reply } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

    //  console.log(reply);
  try {
    const newReply = await prisma.protocol_Comment.create({
      data: {
        body: reply.body,
        // post: reply.post,
        protocol: { connect: { id: reply.protocol.id } },
        subreddit: {
          connect: {
            name: reply.subReddit,
          },
        },
        user: {
          connect: {
            id: String(session.userId),
          },
        },
        votes: {
          create: {
            protocol: { connect: { id: reply.protocol.id } },
            user: { connect: { id: String(session.userId)}},
            voteType: "UPVOTE",
          },
        },
      },
    });

    return res.json(newReply);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

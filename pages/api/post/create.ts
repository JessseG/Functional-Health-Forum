import prisma from "../../../db";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const { post } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        body: post.body,
        title: post.title,
        subreddit: {
          connect: {
            name: post.subReddit,
          },
        },
        user: {
          connect: {
            id: Number(session.userId),
          },
        },
        votes: {
          create: {
            user: { connect: { id: Number(session.userId) } },
            voteType: "UPVOTE",
          },
        },
      },
    });

    return res.json(newPost);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

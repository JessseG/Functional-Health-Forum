import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { post } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        body: post.body,
        subreddit: {
          connect: {
            name: post.subReddit,
          },
        },
        user: {
          connect: {
            id: String(session.userId),
          },
        },
        votes: {
          create: {
            user: { connect: { id: String(session.userId) } },
            voteType: "UPVOTE",
          },
        },
      },
    });

    return res.json(newPost);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

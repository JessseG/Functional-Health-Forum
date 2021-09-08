import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sub = await prisma.subreddit.findUnique({
      where: { name: String(req.query.name) },
      include: {
        posts: {
          include: {
            subreddit: true,
            user: true,
          },
        },
      },
    });

    if (!sub) {
      return res.status(500).json({ error: "No such sub was found" });
    }

    res.json(sub);
  } catch (error) {
    res.json(error);
  }
};

export default handler;

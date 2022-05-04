import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sub } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  try {
    const userJoinSub = await prisma.$transaction(
      [
        prisma.user.update({
          where: { email: session.user.email },
          data: {
            joinedSubs: {
              connect: {
                name: sub,
              },
            },
          },
        }),
        prisma.subreddit.update({
          where: { name: sub },
          data: {
            joinedUsers: {
              connect: { 
                email: session.user.email,
              },
            },
          },
        })
      ]
    );

    return res.json(userJoinSub);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

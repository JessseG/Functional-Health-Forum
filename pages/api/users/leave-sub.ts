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
    // all or nothing transaction
    const userLeaveSub = await prisma.$transaction(
      [
        // removes sub from current user's model
        prisma.user.update({
          where: { email: session.user.email },
          data: {
            joinedSubs: {
              disconnect: {
                name: sub,
              },
            },
          },
        }),
        // removes user from the particular sub model
        prisma.subreddit.update({
          where: { name: sub },
          data: {
            joinedUsers: {
              disconnect: {
                email: session.user.email,
              },
            },
          },
        })
      ]
    );

    return res.json(userLeaveSub);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

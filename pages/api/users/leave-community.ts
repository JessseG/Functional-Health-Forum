import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { com } = req.body;
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
            joinedCommunities: {
              disconnect: {
                name: com,
              },
            },
          },
        }),
        // removes user from the particular sub model
        prisma.community.update({
          where: { name: com },
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

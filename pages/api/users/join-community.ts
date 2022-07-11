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
    const userJoinCom = await prisma.$transaction(
      [
        prisma.user.update({
          where: { email: session.user.email },
          data: {
            joinedCommunities: {
              connect: {
                name: com,
              },
            },
          },
        }),
        prisma.community.update({
          where: { name: com },
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

    return res.json(userJoinCom);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

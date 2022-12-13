import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { protocol } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(500).json({ error: "You have to be logged in" });
  }

  try {
    const newProtocol = await prisma.protocol.create({
      data: {
        title: protocol.title,
        body: protocol.body,
        products: {
          create: protocol.products,
        },
        community: {
          connect: {
            name: protocol.community,
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

    return res.json(newProtocol);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { post } = req.body;
  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        body: post.body,
      },
    });

    console.log(updatedPost);

    return res.json(updatedPost);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

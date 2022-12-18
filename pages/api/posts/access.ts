import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  //   const session = await getSession({ req });

  //   const id = id;

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  try {
    const accessPost = await prisma.post.findUnique({
      where: { id: id }, // id : id
      select: {
        accessCode: true,
      },
    });

    if (!accessPost) {
      return res.status(500).json({ error: "Post no longer exits" });
    }

    return res.json(accessPost);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

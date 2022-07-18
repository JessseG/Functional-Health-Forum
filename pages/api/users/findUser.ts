import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.query.id) },
      select: {
        reset_token: true,
      },
    });

    if (!user) {
      return res.status(500).json({ error: "No such user was found" });
    }

    // This returns the data content of a user to the SSR async funtion in '[com]/index.tsx'
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export default handler;

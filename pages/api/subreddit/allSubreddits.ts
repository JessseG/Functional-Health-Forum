import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

// const prisma = new PrismaClient();

/* 
  Sets up an API for retreiving 
  the names of all the subreddits.
*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // fetches the names of the subreddits from the database through Prisma ORM
    const allSections = await prisma.subreddit.findMany();
    res.json(allSections);
  } catch (error) {
    res.json(error);
  }
};

export default handler;

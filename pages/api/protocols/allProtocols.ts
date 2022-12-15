import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "../../../db";

// const prisma = new PrismaClient();

/* 
  Sets up an API for retreiving 
  the names of all the protocols.
*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // fetches the protocols from the database through Prisma ORM
    const allProtocols = await prisma.protocol.findMany();
    return res.json(allProtocols);
  } catch (error) {
    return res.json(error);
  }
};

export default handler;

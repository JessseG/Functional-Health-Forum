import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { newCom } = req.body;
  //   const session = await getSession({ req });

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  try {
    const newCommunity = await prisma.community.create({
      data: {
        displayName: newCom.displayName,
        infoBoxText: newCom.infoBoxText,
        name: newCom.name,
      },
    });
    return res.json(newCommunity);
  } catch (e) {
    // console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;

import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { compare } from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, accessCode } = req.body;
  const session = await getSession({ req });

  //   const id = id;

  // if (!session) {
  //   return res.status(500).json({ error: "You have to be logged in" });
  // }

  if (req.method === "POST") {
    if (accessCode.length === 0 || !accessCode.replace(/\s/g, "").length) {
      return res.json(false);
    }

    try {
      // OR we can also use a env variable
      const superAccess = await prisma.magicAccessTool.findFirst({
        select: {
          masterAccessCode: true,
        },
      });

      // compare(
      //   accessCode,
      //   superAccess.masterAccessCode,
      //   async function (err, result) {
      //     if (!err && result) {
      //       return res.json(true);
      //     }
      //   }
      // );

      if (superAccess.masterAccessCode === accessCode) {
        return res.json(true);
      }

      const accessProtocol = await prisma.protocol.findUnique({
        where: { id: id },
        select: {
          accessCode: true,
        },
      });

      if (!accessProtocol) {
        return res.status(500).json({ error: "Post no longer exits" });
      } else {
        if (accessProtocol.accessCode === accessCode) {
          return res.json(true);
        } else {
          return res.json(false);
        }
      }
    } catch (e) {
      // console.log(e);
      return res.status(500).json({ error: e });
    }
  } else {
    return res.status(405).json({ status: "failure", message: "POST Only" });
  }
};

export default handler;

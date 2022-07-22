import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.body;
  const session = await getSession({ req });
  // const { sendConfirmationEmail } = require("./mailer");

  if (session) {
    return res
      .status(500)
      .json({ status: "failure", error: "You are already logged in" });
  }

  if (req.method === "POST") {
    // Store hash in password db
    // Check if a user with email already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: String(req.body.email) },
      });
      if (!existingUser) {
        return res.json({
          status: "failure",
          error: "Invalid email/password",
        });
      } else if (existingUser && existingUser.emailVerified) {
        compare(
          req.body.password,
          existingUser.password,
          async function (err, result) {
            if (!err && result) {
              // const claims = {
              //   sub: existingUser.id,
              //   email: existingUser.email,
              // };
              // const jwt = sign(claims, "e4fe62cf-c43a-4a07-ad3c-abcda40aef40", {
              //   expiresIn: "1h",
              // });
              // console.log(jwt);
              // return res.json({ authToken: jwt });
              return res.json(existingUser);
            } else {
              return res.json({
                status: "failure",
                error: "Invalid email/password",
              });
            }
          }
        );
      }
      // return res.json(existingUser);   // later for when called from Next-Auth -- Must remove returns above
    } catch (e) {
      // console.log({ error: e });
      return res.status(500).json({ error: e });
    }
  } else {
    return res.status(405).json({ status: "failure", message: "POST Only" });
  }
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import prisma from "../../../db";
import { getSession } from "next-auth/react";
import { hash } from "bcrypt";
import { compare } from "bcrypt";

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pw, userID, resetToken } = req.body;

  if (req.method === "POST") {
    if (!userID || !resetToken || !pw) {
      return res.status(401).json({ message: "Cannot Validate User" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: String(userID) },
        select: {
          id: true,
          reset_token: true,
        },
      });
      if (!user) {
        return res.json({
          status: "failure",
          error: "No user found",
        });
      } else if (user && user.id && user.reset_token) {
        // compare resetTokens first then hash new password
        if (resetToken === user.reset_token) {
          try {
            hash(pw, 10, async function (err, hash) {
              if (user) {
                const passwordReset = await prisma.user.update({
                  where: { id: userID },
                  data: {
                    password: hash,
                    reset_token: "",
                  },
                });
                if (passwordReset) {
                  return res.json({
                    status: "success",
                    error: "Password Updated - Reset token disactivated",
                  });
                } else {
                  return res.json({
                    status: "failure",
                    error: "Prisma password update failed",
                  });
                }
              } else {
                return res.json({
                  status: "failure",
                  error: "User does not exist",
                });
              }
            });
          } catch (e) {
            return res.json({
              status: "failure",
              message: "Reset token comparison Failed",
              error: e,
            });
          }
        } else {
          return res.json({
            status: "failure",
            error: "Invalid Reset Token",
          });
        }
      }
    } catch (e) {
      return res.json({
        status: "failure",
        error: e,
      });
    }
  }
};

export default resetPassword;

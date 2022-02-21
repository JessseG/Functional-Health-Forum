import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { hash } from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.body;
  const session = await getSession({ req });
  // const express = require("express");
  // const cors = require("cors");
  // const app = express();
  // const { sendConfirmationEmail } = require("./mailer");

  if (session) {
    return res.status(500).json({ error: "You are already logged in" });
  }

  if (req.method === "POST") {
    // Store hash in password db
    // Check if a user with email already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: String(user.email) },
      });
      if (existingUser) {
        return res.json({ status: "failure", error: "Email is taken" });
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    hash(user.password, 10, async function (err, hash) {
      try {
        const newUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            dobDay: user.dobDay,
            dobMonth: user.dobMonth,
            dobYear: user.dobYear,
            password: hash,
          },
        });
        return res.json({ status: "success" });
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    });
  } else {
    res.status(405).json({ message: "POST Only" });
  }
};

export default handler;

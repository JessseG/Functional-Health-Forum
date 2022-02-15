import prisma from "../../../db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const { user } = req.body;
  const session = await getSession({ req });
  // const express = require("express");
  // const cors = require("cors");
  // const app = express();
  // const { sendConfirmationEmail } = require("./mailer");

  if (session) {
    return res.status(500).json({ error: "You are already logged in" });
  }

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

  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        dobDay: user.dobDay,
        dobMonth: user.dobMonth,
        dobYear: user.dobYear,
        password: user.password,
      },
    });
    return res.json(newUser);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;

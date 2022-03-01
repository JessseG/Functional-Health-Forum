import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { hash } from "bcrypt";
import sendConfirmationEmail from "./mailer";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.body;
  const session = await getSession({ req });
  // const express = require("express");
  // const cors = require("cors");
  // const app = express();
  // const { sendConfirmationEmail } = require("./mailer");

  // let mailerAPI = {
  //   method: "POST",
  //   url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: ,
  // }

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
        const pUser = await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            dobDay: user.dobDay,
            dobMonth: user.dobMonth,
            dobYear: user.dobYear,
            password: hash,
          },
        });
        // console.log(pUser);
        if (pUser) {
          const sendEmail: AxiosRequestConfig = {
            method: "post",
            url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
            headers: {
              "Content-Type": "application/json",
            },
            data: { email: pUser.email, name: pUser.name },
          };

          try {
            // const response = await axios(sendEmail);
            const response: AxiosResponse = await axios(sendEmail);
            if (response.status === 200) {
              console.log("Success");
            }
          } catch (e) {
            console.log(e);
          }

          // await sendConfirmationEmail({
          //   pUser: { email: process.env.GOOGLE_USER, name: pUser.name },
          //   identifier: { email: pUser.email },
          //   hash: pUser.id,
          //   url: process.env.NEXTAUTH_URL,
          //   provider: { server: null, from: process.env.GOOGLE_USER },
          // });
          // const resp = await fetch("/api/auth/mailer", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     email: pUser.email,
          //     name: pUser.name,
          //     hash: pUser.id,
          //   }),
          // });
          // .then((response) => response.json())
          // .then((data) => {
          //   return data;
          // });
        }
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

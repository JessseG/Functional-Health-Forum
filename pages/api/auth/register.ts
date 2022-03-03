import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { hash } from "bcrypt";
import sendConfirmationEmail from "./mailer";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import moment from "moment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pUser } = req.body;
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

  const verifyInt = (str) => {
    for (let i = 0; i < str.length; i++) {
      if (!Number.isInteger(parseInt(str[i]))) {
        return false;
      }
    }
    return true;
  };

  if (session) {
    return res.status(500).json({ error: "You are already logged in" });
  }

  if (req.method === "POST") {
    // Store hash in password db
    // Check if a user with email already exists
    // First Validate all the entries
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !regexp.test(pUser.email) ||
      !pUser.name ||
      /^\s*$/.test(pUser.name) ||
      !pUser.email ||
      /^\s*$/.test(pUser.email) ||
      !pUser.dobDay ||
      !pUser.dobYear ||
      pUser.dobMonth === null ||
      !verifyInt(pUser.dobDay) ||
      !verifyInt(pUser.dobYear) ||
      pUser.dobMonth === null ||
      !moment.months().includes(pUser.dobMonth) ||
      0 === parseInt(pUser.dobDay) ||
      31 < parseInt(pUser.dobDay) ||
      parseInt(pUser.dobYear) < 1900 ||
      new Date().getFullYear() < parseInt(pUser.dobYear) ||
      pUser.password.length < 8
    ) {
      return res.status(500).json({ error: "Invalid entry" });
    }

    try {
      const pendingUser = await prisma.pUser.findUnique({
        where: { email: String(pUser.email) },
      });
      const existingUser = await prisma.user.findUnique({
        where: { email: String(pUser.email) },
      });
      if (pendingUser || existingUser) {
        return res.json({ status: "failure", error: "Email is taken" });
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    hash(pUser.password, 10, async function (err, hash) {
      try {
        const pendUser = await prisma.pUser.create({
          data: {
            name: pUser.name,
            email: pUser.email,
            dobDay: pUser.dobDay,
            dobMonth: pUser.dobMonth,
            dobYear: pUser.dobYear,
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
            data: {
              email: pendUser.email,
              name: pendUser.name,
              hash: pendUser.id,
            },
          };

          try {
            // const response = await axios(sendEmail);
            const response: AxiosResponse = await axios(sendEmail);
            if (response.status === 200) {
              console.log("Message Sent: Success");
            }
          } catch (e) {
            // console.log(e);
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

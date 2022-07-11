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

  // unecessary?
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
      console.log("error here - 1");
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
      console.log("error here - 2");
      return res.status(500).json({ error: e });
    }

    hash(pUser.password, 10, async function (err, hash) {
      try {
        // Only create pending user if email is success
        const pendUser = await prisma.pUser.create({
          data: {
            name: pUser.name,
            email: pUser.email,
            dobDay: pUser.dobDay,
            dobMonth: pUser.dobMonth,
            dobYear: pUser.dobYear,
            password: hash,
          },
          select: {
            id: true,
            name: true,
            email: true,
          }
        });

        // console.log("pendUser: ", pendUser);

        // After a pending user is created successfully, then do this below
        if (pendUser) {
          const sendEmail: AxiosRequestConfig = {
            method: "post",
            url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json",
            },
            data: {
              email: pendUser.email,
              name: pendUser.name,
              hash: pendUser.id,
            },
          };

          // here make axios untitled

            // const response = await axios(sendEmail);
            if(sendEmail) {
              const ress = await axios(sendEmail)
                .then(async function (response) {
                  // console.log("axios res: ", response);
                  // console.log("Axios Response data: ", response.data);
                  if(response.data) {
                    return res.json({ status: "success" });
                  }
                  // console.log("axios res data: ");
                })
                .catch(function (error) {
                  // console.log("axios error: ", error);
                  return res.json({ status: "failure" });

                })
              // console.log("response: ", response.data);
            }

            

            // console.log("response: ", response);

            // console.log("response from register.ts @ line 127: ", response);

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
        // return res.json({ status: "success" });
      } catch (e) {
        console.log(e);
        return res.json({ error: e });
      }
    });
  } else {
    return res.status(405).json({ message: "POST Only" });
  }
  // return res.json({ status: "failure" });
};

export default handler;

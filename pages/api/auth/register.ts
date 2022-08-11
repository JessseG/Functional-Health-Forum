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
      !pUser.username ||
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
      const pendingUserEmail = await prisma.pUser.findUnique({
        where: { email: String(pUser.email) },
      });
      const pendingUserName = await prisma.pUser.findUnique({
        where: { username: String(pUser.username) },
      });
      const existingUserEmail = await prisma.user.findUnique({
        where: { email: String(pUser.email) },
      });
      const existingUserName = await prisma.user.findUnique({
        where: { username: String(pUser.username) },
      });
      if (existingUserEmail || existingUserEmail) {
        return res.json({ status: "failure", error: "Email is taken" });
      }
      if (pendingUserName || existingUserName) {
        return res.json({ status: "failure", error: "Username is taken" });
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    hash(pUser.password, 10, async function (err, hash) {
      try {
        // Only create pending user if email is success
        const pendUser = await prisma.pUser.create({
          data: {
            name: pUser.name,
            email: pUser.email,
            username: pUser.username,
            dobDay: pUser.dobDay,
            dobMonth: pUser.dobMonth,
            dobYear: pUser.dobYear,
            collaborator: false,
            password: hash,
          },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            collaborator: true,
          },
        });

        // Some simple styling options
        const backgroundColor = "#f9f9f9";
        const textColor = "#444444";
        const mainBackgroundColor = "#ffffff";
        const buttonBackgroundColor = "#346df1";
        const buttonBorderColor = "#346df1";
        const buttonTextColor = "#ffffff";

        // After a pending user is created successfully, then do this below
        if (pendUser) {
          const email_subject = "Activation Email";

          const html_message = `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  <strong>Welcome to our Functional Medicine Forum!</strong>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 8px 0px 0px 0px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  Click on this link to activate your account and sign in
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 13px 0;">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${process.env.NEXTAUTH_URL}/api/activate/user/${pendUser.id}" target="_blank" style="font-size: 13px; 
                      font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 20px; border: 1px solid ${buttonBorderColor}; 
                      display: inline-block; font-weight: bold;">Activate Account</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0px 0px 5px 0px; text-decoration: underline; font-size: 12px; line-height: 17px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  If you did not request this email you can safely ignore it.
                </td>
              </tr>
            </table>
          </body>`;

          const sendEmail: AxiosRequestConfig = {
            method: "post",
            url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: {
              email: pendUser.email,
              email_subject: email_subject,
              html_message: html_message,
            },
          };

          // const response = await axios(sendEmail);
          if (sendEmail) {
            const ress = await axios(sendEmail)
              .then(async function (response) {
                // console.log("axios res: ", response);
                // console.log("Axios Response data: ", response.data);
                if (response.data) {
                  // console.log("response status: ", response.status);
                  // console.log("response statusText: ", response.statusText);
                  return res.json({ status: "success" });
                }
                // console.log("axios res data: ");
              })
              .catch(function (error) {
                // console.log("axios error: ", error);
                return res.json({ status: "failure" });
              });
            // console.log("response: ", response.data);
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
        // return res.json({ status: "success" });
      } catch (e) {
        // console.log(e);
        return res.json({ error: e });
      }
    });
  } else {
    return res.status(405).json({ message: "POST Only" });
  }
};

export default handler;

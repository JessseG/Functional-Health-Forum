import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { compare } from "bcrypt";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const session = await getSession({ req });

  // console.log("email: ", email);

  if (session) {
    return res.status(500).json({ error: "You are already logged in" });
  }

  if (req.method === "POST") {
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
        const userID = existingUser.id;
        hash("ie0ifne-fj9320g-n320n-*H&R#", 10, async function (err, hash) {
          try {
            const tokenatedUser = await prisma.user.update({
              where: { id: userID },
              data: {
                reset_token: hash,
              },
              select: {
                reset_token: true,
              },
            });

            // Some simple styling options
            const backgroundColor = "#f9f9f9";
            const textColor = "#444444";
            const mainBackgroundColor = "#ffffff";
            const buttonBackgroundColor = "#346df1";
            const buttonBorderColor = "#346df1";
            const buttonTextColor = "#ffffff";

            const email_subject = "Password Reset Email";

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
                          <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${process.env.NEXTAUTH_URL}/reset/${userID}/${tokenatedUser.reset_token}" target="_blank" style="font-size: 13px; 
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
                "Content-Type": "application/json",
              },
              data: {
                email: email,
                email_subject: email_subject,
                html_message: html_message,
              },
            };

            if (sendEmail) {
              const ress = await axios(sendEmail)
                .then(async function (response) {
                  // console.log("axios res: ", response);
                  // console.log("Axios Response data: ", response.data);
                  if (response.data) {
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
          } catch (e) {
            return res.json({
              status: "failure",
              error: e,
            });
          }
        });
      }
    } catch (e) {
      console.log({ error: e });
      return res.status(500).json({ error: e });
    }
  } else {
    res.status(405).json({ message: "POST Only" });
  }
};

export default handler;

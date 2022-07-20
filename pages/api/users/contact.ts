import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, message } = req.body;

  if (req.method === "POST") {
    try {
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
                      <strong>Healwell User Support</strong>
                  </td>
                  </tr>
                  <tr>
                  <td align="center" style="padding: 8px 0px 0px 0px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                      Click on this link to reset your password
                  </td>
                  <tr>
                  <td align="center" style="padding: 13px 0;">
                      <table border="0" cellspacing="0" cellpadding="0" >
                      <tr>
                          <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; 
                          padding: 7px 20px; border: 1px solid ${buttonBorderColor};
                          display: inline-block; font-weight: bold;"><span>Contact Name: ${name}</span></td>
                      </tr>
                      <tr>
                          <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; 
                          padding: 7px 20px; border: 1px solid ${buttonBorderColor};
                          display: inline-block; font-weight: bold;"><span>Contact Email: ${email}</span></td>
                      </tr>
                      <tr>
                          <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; 
                          padding: 7px 20px; border: 1px solid ${buttonBorderColor};
                          display: inline-block; font-weight: bold;"><span>Message: ${message}</span></td>
                      </tr>
                      </table>
                  </td>
                  </tr>
                  <tr>
                  <td align="center" style="padding: 0px 0px 5px 0px; text-decoration: underline; font-size: 12px; line-height: 17px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                      The information contained in these emails is private user information.
                  </td>
                  </tr>
              </table>
            </body>`;

      const healwell_email = "support@healwell.io";

      const sendEmail: AxiosRequestConfig = {
        method: "post",
        url: `${process.env.NEXTAUTH_URL}/api/auth/mailer`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: healwell_email,
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
  } else {
    res.status(405).json({ message: "POST Only" });
  }
};

export default handler;

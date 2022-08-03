import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, message } = req.body;

  if (req.method === "POST") {
    try {
      // Some simple styling options
      const backgroundColor = "#e2e2e2";
      const textColor = "#444444";
      const mainBackgroundColor = "white";
      const buttonBackgroundColor = "#346df1";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "rgb(31, 31, 31)";

      const email_subject = "Healwell User Contact";

      const html_message = `
            <body style="background: ${backgroundColor};">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding: 10px 0px 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};"></td>
                  </tr>
              </table>
              <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 5px;">
                  <tr>
                    <td align="center" style="padding: 25px 0px 0px 0px; font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                        <strong>Healwell User Support</strong>
                    </td>
                  </tr>
                  <tr>
                    <tr>
                      <td align="center" style="padding: 18px 0;">
                        <table border="0" cellspacing="0" cellpadding="0" >
                          <tr style="width:100%;">
                            <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 25px; display: inline-block; font-weight: bold; display: flex; flex-direction: row;">
                              <span style="flex: none;">Name: </span>
                              <span style="margin-left: 5px; color: rgb(47, 47, 47); font-weight: 400;">${name}</span>
                            </td>
                          </tr>
                          <tr style="width:100%;">
                            <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 25px; display: inline-block; font-weight: bold; display: flex; flex-direction: row;">
                              <span style="flex: none;">Email: </span>
                              <span style="margin-left: 5px; color: rgb(47, 47, 47); font-weight: 400;">${email}</span>
                            </td>
                          </tr>
                          <tr style="width:100%;">
                            <td style="font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 7px 25px; display: inline-block; font-weight: bold; display: flex; flex-direction: row;">
                              <span style="flex: none;">Message: </span>
                              <span style="margin-left: 5px; color: rgb(47, 47, 47); font-weight: 400;">${message}</span>
                            </td>
                          </tr>
                        </table>      
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0px 0px 18px 0px; text-decoration: underline; font-size: 12px; line-height: 17px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                        The information contained in these emails is private user information
                    </td>
                  </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding: 10px 0px 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};"></td>
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

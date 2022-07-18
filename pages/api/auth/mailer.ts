import nodemailer from "nodemailer";
import prisma from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, email_subject, html_message } = req.body;

  // console.log("email: ", email);

  // const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  // const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  try {
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
      // dkim: {
      //   domainName: "healwell.io",
      //   keySelector: "2017",
      //   privateKey: process.env.DKIM_PK,
      // },
    });

    const mailOptions = {
      from: "support@healwell.io",
      to: email,
      subject: email_subject,
      html: html_message,
    };

    await transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        // console.log(error);
        // res.json(error);
        return res.json(error);
      } else {
        // console.log('Email sent: ' + info.response);
        return res.json(info.response);
        // res.redirect("/checkMail");
        // return info.response;
      }
    });

    // const emailRes = await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Activation Email",
    //   html: html_message,
    // });
    // console.log("Message Sent: ", emailRes.messageId);

    // return res.json({did it above});
  } catch (e) {
    console.log(e);
    return res.json({ error: e });
  }
};

export default handler;

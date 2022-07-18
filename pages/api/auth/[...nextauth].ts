import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import Post from "../../../components/post";
import { servicesVersion } from "typescript";
import { useState } from "react";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: "test",
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        //________________________________

        // const user = { id: "4", name: "J Smith", email: "jsmith@example.com" };

        // if (credentials.username === "john" && credentials.password === "pw") {
        //   return user;
        // }

        // return null; // failed
        //________________________________

        // console.log("cred", credentials);

        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        // console.log("post", user);

        if (user.email) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // first time jwt callback is ran (@successful login), user object is available
      if (user) {
        // console.log("user", user);
        token.id = user.id;
      }
      // console.log("account", account);
      return token;
    },
    async session({ session, token, user }) {
      // if (user) {
      //   session.userId = user.id;
      // }

      if (token) {
        session.userId = token.id;
        // console.log("session", session);
      }
      // return session;
      return Promise.resolve(session);
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "test-j0e0vne90vne30ivbn9-0nvr0vn0rn",
  },
});

// const options = {
//   providers: [
//     // OAuthentication providers ...
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     }),
//   ],
//   // Optional SQL or MongoDB database to presist users
//   adapter: PrismaAdapter(prisma),
//   callbacks: {
//     async session({ session, token, user }) {
//       // Send properties to the client, like an access_token from a provider.
//       session.userId = user.id;
//       return Promise.resolve(session);
//     },
//   },
// };

// export default (req, res) => NextAuth(req, res, options);

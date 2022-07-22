import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { CSSProperties, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchData } from "../../../utils/utils";
import { months } from "moment";
import Select from "react-select";
import Link from "next/link";
import {
  faHome,
  faHomeUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  signIn,
  getSession,
  getProviders,
  getCsrfToken,
  useSession,
} from "next-auth/react";
import { resourceLimits } from "worker_threads";
import prisma from "../../../db";
import useSWR from "swr";
import { Prisma, User } from "@prisma/client";

// A way of reformatting the props to be able to use Typescript features
type ResetUser = Prisma.UserGetPayload<{
  select: {
    reset_token: true;
  };
}>;

const Reset = ({ resetUser: props }: { resetUser: ResetUser }) => {
  const router = useRouter();
  const userID = router.query.reset;
  const resetToken = router.query.token;
  const inputNewPasswordElement = useRef(null);
  const { data: session } = useSession();

  const findUserUrl = `/api/users/findUser/?id=${userID}`;

  // If resetUser fails, error comes in
  const { data: resetUser, error } = useSWR(findUserUrl, fetchData, {
    fallbackData: props,
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }

    if (inputNewPasswordElement.current) {
      inputNewPasswordElement.current.focus();
    }

    if (resetUser && resetUser.reset_token !== resetToken) {
      router.push("/_error");
    }
  }, []);

  const [newPasswords, setNewPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState([
    {
      passwordMinimum: false,
      message: "Minimum 8 characters",
      isTouched: false,
    },
    {
      passwordsMatch: false,
      message: "Passwords do not match",
      isTouched: false,
    },
  ]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (
      newPasswords.password.length < 8 ||
      newPasswords.confirmPassword.length < 8 ||
      newPasswords.password !== newPasswords.confirmPassword
    ) {
      setNewPasswords((state) => ({
        ...state,
        password: "",
        confirmPassword: "",
      }));
      return;
    }

    // api request - send email
    const resetPassword = await fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pw: newPasswords.password,
        userID: userID,
        resetToken: resetToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("email sent from forgot.tsx to forgot.ts");
        return data;
      });

    NProgress.done();

    if (resetPassword.status && resetPassword.status === "success") {
      setNewPasswords((state) => ({
        ...state,
        password: "",
        confirmPassword: "",
      }));
      setFormSubmitted(false);
      router.push("/login");
    } else if (resetPassword.status && resetPassword.status === "failure") {
      setNewPasswords((state) => ({
        ...state,
        password: "",
        confirmPassword: "",
      }));
      setFormSubmitted(false);
      router.push("/_error");
    }
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto pb-20 flex flex-col sm:min-w-[28rem] flex-1 bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handlePasswordReset}
            className="m-auto px-14 pt-14 pb-6 container self-center w-full bg-white rounded-lg border-[0.09rem] border-rose-400"
          >
            <div className="mx-auto my-8 h-32 w-32 relative">
              <Image
                layout="fill"
                className="border border-black hue-rotate-[130deg] cursor-pointer saturate-100"
                src="/images/bacteria-icon.png"
                alt="Home"
                title="Home"
                onClick={() => router.push("/")}
              />
            </div>
            <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
              Reset Password
            </h3>
            <div className="mt-7">
              {
                <div className="text-center">
                  <button type="button">
                    Please enter your new password below
                  </button>
                </div>
              }
            </div>
            <div
              className={`mt-5 container rounded-sm`}
              //   ${formSubmitted && (!passwordValidation[0].passwordMinimum || !passwordValidation[1].passwordsMatch)? "ring-red-600" : ""}
            >
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                ref={inputNewPasswordElement}
                type="password"
                placeholder="Password"
                value={newPasswords.password}
                onChange={(e) => {
                  if (!passwordValidation[0].isTouched) {
                    const newValidation = [...passwordValidation];
                    newValidation[0].isTouched = true;
                    setPasswordValidation(newValidation);
                  }
                  setNewPasswords((state) => ({
                    ...state,
                    password: e.target.value,
                  }));
                }}
                className={`px-3 py-2 placeholder-gray-400 text-black relative 
                 bg-white rounded-sm border-0 shadow-md outline-none ring-2
                focus:outline-none w-full ${
                  (formSubmitted && newPasswords.password.length < 8) ||
                  (newPasswords.password !== newPasswords.confirmPassword &&
                    passwordValidation[1].isTouched)
                    ? "ring-red-600"
                    : ""
                }`}
              />
              {(formSubmitted &&
                passwordValidation[0].isTouched &&
                newPasswords.password.length < 8 && (
                  <div className="-mb-3 px-2 pt-1.5 text-red-600 text-sm">
                    {passwordValidation[0].message}
                  </div>
                )) ||
                (formSubmitted && newPasswords.password.length < 8 && (
                  <div className="-mb-3 px-2 pt-1.5 text-red-600 text-sm">
                    {passwordValidation[0].message}
                  </div>
                ))}
            </div>
            <div
              className={`mt-5 container rounded-sm`}
              //   ${formSubmitted && (!passwordValidation[0].passwordMinimum || !passwordValidation[1].passwordsMatch) ? "ring-red-600" : ""}
            >
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="password"
                placeholder="Confirm Password"
                value={newPasswords.confirmPassword}
                onChange={(e) => {
                  if (!passwordValidation[1].isTouched) {
                    const newValidation = [...passwordValidation];
                    newValidation[1].isTouched = true;
                    setPasswordValidation(newValidation);
                  }
                  setNewPasswords((state) => ({
                    ...state,
                    confirmPassword: e.target.value,
                  }));
                }}
                className={`px-3 py-2 placeholder-gray-400 text-black relative ring-2
                bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full
                ${
                  (newPasswords.password !== newPasswords.confirmPassword &&
                    passwordValidation[1].isTouched) ||
                  (formSubmitted && !newPasswords.confirmPassword)
                    ? "ring-red-600"
                    : ""
                }`}
              />
              {newPasswords.password !== newPasswords.confirmPassword &&
                passwordValidation[1].isTouched && (
                  <div className="-mb-3 px-3 pt-1.5 text-red-600 text-sm">
                    {passwordValidation[1].message}
                  </div>
                )}
            </div>
            {/* </div> */}
            <div className="mt-5 w-full border-black flex justify-between">
              <Link href={"/register"}>
                <div className="inline-block px-1 mt-0.5 text-sky-700 font-semibold text-sm++ justify-self-end underline underline-offset-1 cursor-pointer">
                  Create Account
                </div>
              </Link>
              <button
                className="px-2.5 py-1 border hover:bg-indigo-300 text-gray-700 bg-indigo-200 text-lg-
               font-semibold border-gray-500 rounded-sm+ outline-none"
                type="submit"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="bg-red-600 sm:bg-yellow-500 md:bg-green-400 lg:bg-blue-600 xl:bg-purple-500 2xl:bg-pink-600">
        Size
      </div> */}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  /* 
      The 'com' in (ctx.query.com) refers to the {com} object returned by 
      the handler function in 'findCommunity.ts', containing the set of 
      data for the particular community requested.
  */

  const url = `${process.env.NEXTAUTH_URL}/api/users/findUser/?id=${ctx.query.reset}`;

  const resetUser = await fetchData(url);
  // This 'resetUser' contains all the contents of the selected community

  return {
    props: {
      resetUser,
    },
  };
}

export default Reset;

import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useState, useRef } from "react";
import { Puff } from "react-loader-spinner";
import Image from "next/image";
import { fetchData } from "../../../utils/utils";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Prisma } from "@prisma/client";

// A way of reformatting the props to be able to use Typescript features
type ResetUser = Prisma.UserGetPayload<{
  select: {
    reset_token: true;
    updatedAt: true;
  };
}>;

const Reset = ({ resetUser: props }: { resetUser: ResetUser }) => {
  const router = useRouter();
  const userID = router.query.reset;
  const resetToken = router.query.token;
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const inputNewPasswordElement = useRef(null);
  const { data: session } = useSession();
  const [newPasswords, setNewPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
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

  const findUserUrl = `/api/users/findUser/?id=${userID}`;

  // If resetUser fails, error comes in
  const { data: resetUser, error } = useSWR(findUserUrl, fetchData, {
    fallbackData: props,
  });

  useEffect(() => {
    if (resetUser && resetUser.reset_token !== resetToken) {
      router.push("/_error");
    }

    let currentTime = new Date();
    let tokenIssuedTime = new Date(resetUser.updatedAt);

    let minutes = (Number(currentTime) - Number(tokenIssuedTime)) / 60000;

    if (minutes > 60) {
      router.push("/_error");
    }

    if (session) {
      router.push("/");
    }

    if (!isMobile && inputNewPasswordElement.current) {
      inputNewPasswordElement.current.focus();
    }
  }, [resetUser.reset_token]);

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

    setLoading(true);
    setDisableButton(true);

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

      setLoading(false);
      setResetSuccess(true);

      setTimeout(async () => {
        router.push("/login");
      }, 7000);
    } else {
      if (resetPassword.status && resetPassword.status === "failure") {
        setNewPasswords((state) => ({
          ...state,
          password: "",
          confirmPassword: "",
        }));
      }

      setLoading(false);
      setDisableButton(false);
      router.push("/_error");
    }
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto my-auto container flex flex-col flex-1 bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handlePasswordReset}
            className={`m-auto pt-14 pb-7 relative container flex flex-col self-center w-full bg-white max-w-[30rem] rounded-lg -translate-y-8 border-[0.09rem] border-gray-400`}
          >
            {loading && (
              <div className="absolute flex justify-center items-center h-full w-full -translate-y-10 rounded-md opacity-[100] z-10">
                <Puff color="rgb(92, 145, 199)" height={70} width={70} />
              </div>
            )}
            {!resetSuccess && (
              <div
                className={`mx-11 sm:mx-14 ${loading ? "opacity-[10%]" : ""}`}
              >
                <Link href={"/"}>
                  <div className="mx-auto my-8 h-32 w-32 relative">
                    <Image
                      layout="fill"
                      className="border border-black hue-rotate-[130deg] cursor-pointer saturate-100"
                      src="/images/bacteria-icon.png"
                      alt="Home"
                      title="Home"
                    />
                  </div>
                </Link>

                <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
                  Reset Password
                </h3>

                <div className="mt-7">
                  {
                    <div className="container">
                      <div className="text-center">
                        Please enter your new password below
                      </div>
                    </div>
                  }
                </div>
                <div
                  className={`mt-5 container rounded-sm`}
                  //   ${formSubmitted && (!passwordValidation[0].passwordMinimum || !passwordValidation[1].passwordsMatch)? "ring-red-600" : ""}
                >
                  <input
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
                <div className="mt-7 w-full border-black flex justify-between">
                  {/* <Link href={"/register"}>
                    <div className="inline-block px-1 mt-0.5 text-sky-700 font-semibold text-sm++ justify-self-end underline underline-offset-1 cursor-pointer">
                      Create Account
                    </div>
                  </Link> */}
                  <button
                    disabled={disableButton}
                    type="submit"
                    className="mx-auto w-full py-[0.3rem] border hover:saturate-[2] text-gray-700 bg-indigo-200 text-xl
                            font-semibold border-gray-500 rounded-sm+ outline-none"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
            {formSubmitted && resetSuccess && (
              <div>
                <div className="mx-auto bg-white rounded-[2rem] mt-2 mb-8 h-52 w-52 relative">
                  <Image
                    layout="fill"
                    className="cursor-pointer"
                    src="/images/lock-reset-icon.png"
                    alt="Success"
                    title="Success"
                  />
                </div>
                {/* <div className="mx-auto bg-white rounded-[2rem] mt-4 mb-9 h-44 w-44 relative">
                  <Image
                    layout="fill"
                    className="cursor-pointer"
                    src="/images/green-check-icon.png"
                    alt="Success"
                    title="Success"
                  />
                </div> */}
                <h3 className="text-2.5xl mt-6 mb-0 font-semibold text-gray-700 text-center">
                  Password Reset Successful
                </h3>
                <div className="container mt-3 mx-auto">
                  <div className="text-center text-sm+ leading-5 px-12">
                    You will be redirected shortly to the Login Page
                  </div>
                </div>
              </div>
            )}
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

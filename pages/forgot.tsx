import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { CSSProperties, useEffect, useState, useRef } from "react";
import Image from "next/image";
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

const Forgot = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [state, setState] = useState();
  const inputEmailElement = useRef(null);
  const [forgottenUser, setForgottenUser] = useState({
    email: "",
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isTouched: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSucceeded, setFormSucceeded] = useState(false);
  const [providersList, setProvidersList] = useState({});

  useEffect(() => {
    if (session) {
      router.push("/");
    }

    if (inputEmailElement.current) {
      inputEmailElement.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    if (!emailValidation.isTouched) {
      setEmailValidation((state) => ({
        ...state,
        isTouched: true,
      }));
    }
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexp.test(email)) {
      // console.log("email good");
      setEmailValidation((state) => ({
        ...state,
        isValid: true,
      }));
    } else {
      setEmailValidation((state) => ({
        ...state,
        isValid: false,
      }));
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!emailValidation.isValid) {
      return;
    }

    // api request - send email
    const forgotPassword = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: forgottenUser.email.toLowerCase() }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("email sent from forgot.tsx to forgot.ts");
        return data;
      })
      .then(NProgress.done());

    if (forgotPassword && forgotPassword.status === "success") {
      setForgottenUser((state) => ({
        ...state,
        email: "",
      }));
      setFormSubmitted(false);
      router.push("/checkEmail");
    } else {
      setEmailValidation((state) => ({
        ...state,
        isValid: false,
      }));
    }
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto pb-20 flex flex-col flex-1 min-w-[28rem] bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handleForgot}
            className="m-auto px-16 pt-14 pb-6 container self-center w-full bg-white rounded-lg border-[0.07rem] border-rose-400 -translate-y-3"
          >
            <div className="mx-auto my-8 h-32 w-32 relative">
              <Image
                layout="fill"
                className="border border-black hue-rotate-180 rotate-[43deg] bg-cyan-200 cursor-pointer saturate-100"
                src="/images/rod_of_asclepius-2.png"
                alt="Home"
                title="Home"
                onClick={() => router.push("/")}
              />
            </div>
            <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
              Forgot Password
            </h3>
            {/* <div className="mt-7">
              {
                <div key={providers.github.name} className="text-center">
                  <button
                    type="button"
                    onClick={() => signIn(providers.github.id)}
                    className="p-2 my-1.5 w-full bg-zinc-50 rounded text-center border-2 border-gray-400 hover:bg-zinc-100 font-semibold"
                  >
                    Sign in with {providers.github.name}
                  </button>
                </div>
              }
            </div> */}
            <div className="container mt-10">
              {
                <div className="text-center">
                  <button type="button">
                    Please enter your recovery email below
                  </button>
                </div>
              }
            </div>
            <div
              className={`mt-5 ring-2 rounded-sm ${
                formSubmitted && !emailValidation.isValid ? "ring-red-600" : ""
              }`}
            >
              <input
                autoFocus
                // onFocus={(e) => {}}
                ref={inputEmailElement}
                type="text"
                placeholder="Email"
                value={forgottenUser.email}
                onChange={(e) => {
                  validateEmail(e.target.value);
                  setForgottenUser((state) => ({
                    ...state,
                    email: e.target.value,
                  }));
                }}
                className={`px-3 py-1.5 placeholder-gray-400 text-black relative w-full
                bg-white rounded-sm border-b border-gray-200 shadow-md outline-none focus:outline-none container`}
              />
            </div>

            <div className="grid">
              {formSubmitted && !emailValidation.isValid && (
                <div className="inline-block -mb-1.5 px-1 mt-2 text-red-600 text-sm justify-self-start">
                  Invalid Email
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
                Send
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

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers: await getProviders(),
    },
  };
}

export default Forgot;

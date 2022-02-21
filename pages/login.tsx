import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { CSSProperties, useState } from "react";
import Image from "next/image";
import { months } from "moment";
import Select from "react-select";
import Link from "next/link";
import { faHome, faHomeUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  signIn,
  getSession,
  getProviders,
  getCsrfToken,
  useSession,
} from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [state, setState] = useState();
  const [loginUser, setloginUser] = useState({
    email: "",
    password: "",
  });
  const [emailValidation, setEmailValidation] = useState({
    valid: false,
    isTouched: false,
  });
  const [passwordValid, setPasswordValid] = useState({
    valid: false,
    isTouched: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSucceeded, setFormSucceeded] = useState(false);

  // const handleLogin = async () => {
  //   router.back();
  //   signIn();
  //   // this order cause next-auth redirects to main page
  // };

  if (session) {
    router.push("/");
  }

  const validateEmail = (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regexp.test(email)) {
      setEmailValidation((state) => ({
        ...state,
        valid: true,
      }));
    } else {
      setEmailValidation((state) => ({
        ...state,
        valid: false,
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Filter out an empty fields submission.
    if (
      !loginUser.email ||
      /^\s*$/.test(loginUser.email) ||
      loginUser.password.length < 8
    ) {
      return;
    }
    // create new pending User locally
    const user = {
      email: loginUser.email.toLowerCase(),
      password: loginUser.password,
    };

    // api request
    NProgress.start();
    const login = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email, password: user.password }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    // checks if registration was success or failure
    if (login.status === "failure") {
      // console.log(registration);
      setEmailValidation((state) => ({
        ...state,
        isTouched: false,
        userExists: true,
      }));
      setloginUser((state) => ({
        ...state,
        password: "",
      }));
    } //DOUBLE CHECK WHETHER YOU WANT THIS RETURN BASED ON EMAIL
    else if (login.status === "success") {
      // console.log(registration);
      (document.activeElement as HTMLElement).blur();
      setFormSubmitted(false);
      setPasswordValid((state) => ({
        ...state,
        isTouched: false,
      }));
      setloginUser((state) => ({
        ...state,
        email: "",
        password: "",
      }));
    }

    NProgress.done();

    // router.push(`/communities/${sub}`);
  };

  // <div>Log In to use this feature</div>
  // <button onClick={() => handleLogin()}>Login</button>
  // <button onClick={() => router.back()}>Go Back</button>

  return (
    <Layout>
      <div className="mx-auto px-8 h-full flex rounded min-w-1/4 border-indigo-400">
        <form
          onSubmit={handleLogin}
          className="mx-auto container w-full self-center mb-32 border-black"
        >
          <div className="mx-auto my-8 h-20 w-20 relative">
            <Image
              layout="fill"
              className="border border-black cursor-pointer"
              src="/images/rod_of_asclepius-2.png"
              alt="Home"
              title="Home"
              onClick={() => router.push("/")}
            />
          </div>
          {/* <div className="flex-1 border-black text-base+"> */}
          <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
            Sign into your Account
          </h3>
          <div className="mt-9.5">
            <input
              // autoFocus={}
              // onFocus={(e) => {}}
              type="text"
              placeholder="Email"
              value={loginUser.email}
              onChange={(e) => {
                validateEmail(e.target.value);
                setEmailValidation((state) => ({
                  ...state,
                  userExists: false,
                  isTouched: true,
                }));
                setloginUser((state) => ({
                  ...state,
                  email: e.target.value,
                }));
              }}
              className={`px-3 py-2 placeholder-gray-400 text-black relative ring-2 
                bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none container
                ${
                  formSubmitted && !emailValidation.valid ? "ring-red-600" : ""
                }`}
            />
            {formSubmitted && !emailValidation.valid && (
              <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                Invalid email
              </div>
            )}
          </div>
          <div className="mt-6">
            <input
              // autoFocus={}
              // onFocus={(e) => {}}
              type="password"
              placeholder="Password"
              value={loginUser.password}
              onChange={(e) => {
                if (!passwordValid.isTouched) {
                  setPasswordValid((state) => ({
                    ...state,
                    isTouched: true,
                  }));
                }
                setloginUser((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              }}
              className={`px-3 py-2 placeholder-gray-400 text-black relative 
                 bg-white rounded-sm border-0 shadow-md outline-none ring-2
                focus:outline-none container ${
                  (passwordValid.isTouched && loginUser.password.length < 8) ||
                  (formSubmitted && loginUser.password.length < 8)
                    ? "ring-red-600"
                    : ""
                }`}
            />
            {passwordValid.isTouched && loginUser.password.length < 8 && (
              <div className="-mb-6.5 px-3 pt-1 text-red-600 text-sm">
                "Email or password incorrect"
              </div>
            )}
          </div>
          {/* </div> */}
          <div className="mt-3 flex justify-between mx-1.5 text-sm+">
            <Link href={"/"}>
              <div className="inline-block ml-1">
                <FontAwesomeIcon
                  size={"lg"}
                  icon={faHome}
                  className={`cursor-pointer text-gray-600 hover:text-blue-500`}
                  onClick={() => console.log("Upvoted Protocol?")}
                />
              </div>
            </Link>
            <div className="inline-block text-purple-700">
              <Link href={"/forgot-password"}>
                <a>Forgot password?</a>
              </Link>
            </div>
          </div>
          <div className="mt-3 w-full border-black">
            <button
              className="px-3 py-1.5 border w-full hover:bg-indigo-400 text-gray-700 bg-indigo-200 text-lg
               font-semibold border-gray-500 rounded-sm outline-none"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
      {/* <div className="bg-red-600 sm:bg-yellow-500 md:bg-green-400 lg:bg-blue-600 xl:bg-purple-500 2xl:bg-pink-600">
        Size
      </div> */}
    </Layout>
  );
};

export default Login;

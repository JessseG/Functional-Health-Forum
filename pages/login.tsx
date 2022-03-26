import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { CSSProperties, useEffect, useState } from "react";
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

const Login = ({ csrfToken, providers }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [state, setState] = useState();
  const [loginUser, setloginUser] = useState({
    email: "",
    password: "",
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isTouched: false,
  });
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    isTouched: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSucceeded, setFormSucceeded] = useState(false);
  const [providersList, setProvidersList] = useState({});

  // const handleLogin = async () => {
  //   router.back();
  //   signIn();
  //   // this order cause next-auth redirects to main page
  // };

  if (session) {
    router.push("/");
  }

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

  const validatePassword = (password) => {
    if (!passwordValidation.isTouched) {
      setPasswordValidation((state) => ({
        ...state,
        isTouched: true,
      }));
    }
    if (password.length < 8) {
      if (passwordValidation.isValid) {
        setPasswordValidation((state) => ({
          ...state,
          isValid: false,
        }));
      }
    } else {
      if (!passwordValidation.isValid) {
        setPasswordValidation((state) => ({
          ...state,
          isValid: true,
        }));
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Filter out an empty fields submission.
    // if (
    //   !loginUser.email ||
    //   /^\s*$/.test(loginUser.email) ||
    //   loginUser.password.length < 8
    // ) {
    //   return;
    // }
    if (!passwordValidation.isValid || !emailValidation.isValid) {
      return;
    }

    //
    const user = {
      email: loginUser.email.toLowerCase(),
      password: loginUser.password,
    };

    // api request
    NProgress.start();
    const login = await signIn("credentials", {
      email: user.email,
      password: user.password,
    }).then(NProgress.done());
    // console.log(login);
    // const login = await fetch("/api/auth/signin/credentials", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email: user.email, password: user.password }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     return data;
    //   });

    // // checks if registration was success or failure
    // if (login.status === "failure") {
    //   // console.log(registration);
    //   setEmailValidation((state) => ({
    //     ...state,
    //     isTouched: false,
    //     userExists: true,
    //   }));
    //   setloginUser((state) => ({
    //     ...state,
    //     password: "",
    //   }));
    // } //DOUBLE CHECK WHETHER YOU WANT THIS RETURN BASED ON EMAIL
    // else if (login.status === "success") {
    //   // console.log(registration);
    //   (document.activeElement as HTMLElement).blur();
    //   setFormSubmitted(false);
    //   setPasswordValid((state) => ({
    //     ...state,
    //     isTouched: false,
    //   }));
    //   setloginUser((state) => ({
    //     ...state,
    //     email: "",
    //     password: "",
    //   }));
    // }

    // NProgress.done();

    // router.push(`/communities/${sub}`);
  };

  // const callProviders = async () => {
  //   // let options = null;
  //   const options = await getProviders().then((result) =>
  //     result.map((prov) => {
  //       console.log(prov);
  //     })
  //   );
  //   return options;
  // };

  // useEffect(() => {
  //   const handleProviders = async () => {
  //     const providers = await getProviders();
  //     setProvidersList(providers);
  //   };
  //   handleProviders();
  // }, []);

  // console.log(providers);

  // // console.log("Providers", providers);
  // for (let [key, value] of Object.entries(providers)) {
  //   // setProvidersList(providers);
  //   console.log(key, value);
  // }

  // const provider = Object.values(providersList);
  // console.log(providers);

  // handleProviders();

  // const providers = async () => {
  //   await callProviders().then((data) => {
  //     return data;
  //   });
  // };

  // console.log(callProviders());

  // providers().then((data) => {
  //   console.log(data);
  // });

  // console.log("Providers", providers);

  // <div>Log In to use this feature</div>
  // <button onClick={() => handleLogin()}>Login</button>
  // <button onClick={() => router.back()}>Go Back</button>
  // console.log(emailValidation.isValid);
  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto pb-20 flex flex-col flex-1 bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handleLogin}
            className="m-auto px-1 container self-center w-full border-black"
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
            <div className="mt-7">
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
            </div>
            <div
              className={`mt-7 ring-2 rounded-sm ${
                formSubmitted &&
                (!emailValidation.isValid || !passwordValidation.isValid)
                  ? "ring-red-600"
                  : ""
              }`}
            >
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="text"
                placeholder="Email"
                value={loginUser.email}
                onChange={(e) => {
                  validateEmail(e.target.value);
                  setloginUser((state) => ({
                    ...state,
                    email: e.target.value,
                  }));
                }}
                className={`px-3 py-2 placeholder-gray-400 text-black 
                bg-white rounded-sm border-b border-gray-200 shadow-md outline-none focus:outline-none container`}
              />
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="password"
                placeholder="Password"
                value={loginUser.password}
                onChange={(e) => {
                  validatePassword(e.target.value);
                  setloginUser((state) => ({
                    ...state,
                    password: e.target.value,
                  }));
                }}
                className={`px-3 py-2 placeholder-gray-400 text-black 
                 bg-white rounded-sm border-t border-gray-200 shadow-md outline-none
                focus:outline-none container`}
              />
            </div>
            {formSubmitted &&
              (!emailValidation.isValid || !passwordValidation.isValid) && (
                <div className="-mb-1.5 px-3 mt-2 text-red-600 text-sm">
                  Invalid Email or Password
                </div>
              )}
            {/* </div> */}
            <div className="mt-3 flex justify-between mx-1.5 text-sm+">
              {/* <Link href={"/"}>
                <div className="inline-block ml-1">
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faHome}
                    className={`cursor-pointer text-gray-600 hover:text-blue-500`}
                    onClick={() => console.log("Upvoted Protocol?")}
                  />
                </div>
              </Link> */}
              {/* <div className="rounded border px-1.5 py-0.5 -my-1 bg-indigo-200 border-gray-700"> */}
              <Link href={"/register"}>
                <div className="ml-1 cursor-pointer text-gray-600 hover:text-blue-500">
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faUserPlus}
                    className={`cursor-pointer text-gray-600 hover:text-blue-600`}
                  />
                  <a className="ml-2 text-blue-900 font-semibold">Register</a>
                </div>
              </Link>
              {/* </div> */}
              <div className="inline-block text-purple-700 text-right">
                <Link href={"/forgot-password"}>
                  <a>Forgot password?</a>
                </Link>
              </div>
            </div>
            <div className="mt-3 w-full border-black">
              <button
                className="px-3 py-1.5 border w-full hover:bg-indigo-300 text-gray-700 bg-indigo-200 text-lg
               font-semibold border-gray-500 rounded-sm outline-none"
                type="submit"
              >
                Sign In
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

// Login.getInitialProps = async (context) => {
//   const { req, res } = context;
//   const session = await getSession({ req });

//   if (session && res && session.accessToken) {
//     res.writeHead(302, {
//       Location: "/",
//     });
//     res.end();
//     return;
//   }
//   return {
//     session: undefined,
//     providers: await getProviders(),
//     csrfToken: await getCsrfToken(context),
//   };
// };

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers: await getProviders(),
    },
  };
}

export default Login;

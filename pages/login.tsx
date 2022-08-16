import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  signIn,
  getProviders,
  getCsrfToken,
  useSession,
} from "next-auth/react";
import { isMobile } from "react-device-detect";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Puff, TailSpin } from "react-loader-spinner";

const Login = ({ csrfToken, providers }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const inputEmailElement = useRef(null);
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
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [newCallbackPost, setNewCallbackPost] = useState({
    title: null,
    content: null,
    callbackPostUrl: null,
  });
  const [newCallbackProtocol, setNewCallbackProtocol] = useState({
    title: null,
    details: null,
    callbackProtocolUrl: null,
  });
  const [callbackProtocolProducts, setCallbackProtocolProducts] =
    useState(null);

  useEffect(() => {
    if (session) {
      router.push("/");
    }

    // console.log(router.query.newProtocolTitle);
    // console.log(router.query.newProtocolProducts);
    // console.log(router.query.newProtocolDetails);

    if (router.query.callbackPostTitle && router.query.callbackPostContent) {
      setNewCallbackPost((state) => ({
        ...state,
        title: router.query.callbackPostTitle,
        content: router.query.callbackPostContent,
        callbackPostUrl: router.query.callbackPostUrl,
      }));
    }

    if (
      router.query.callbackProtocolTitle &&
      router.query.callbackProtocolDetails &&
      router.query.callbackProtocolProducts
    ) {
      setNewCallbackProtocol((state) => ({
        ...state,
        title: router.query.callbackProtocolTitle,
        details: router.query.callbackProtocolDetails,
        callbackProtocolUrl: router.query.callbackProtocolUrl,
      }));
      // add protocol Products
      setCallbackProtocolProducts(router.query.callbackProtocolProducts);
    }

    if (!isMobile && inputEmailElement.current) {
      inputEmailElement.current.focus();
    }
  }, [session]);

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

    if (!passwordValidation.isValid || !emailValidation.isValid) {
      return;
    }

    // ADD THE LOADER
    setLoading(true);

    setDisableButton(true);

    const user = {
      email: loginUser.email.toLowerCase(),
      password: loginUser.password,
    };

    // api request
    NProgress.start();
    const login = await signIn("credentials", {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    NProgress.done();
    setLoading(false);

    if (login && login.status === 200) {
      // If login triggered from !session in new Post
      if (newCallbackPost.callbackPostUrl) {
        router.push(
          { pathname: newCallbackPost.callbackPostUrl, query: newCallbackPost },
          newCallbackPost.callbackPostUrl
        );
      }
      // If login triggered from !session in new Protocol
      else if (newCallbackProtocol.callbackProtocolUrl) {
        router.push(
          {
            pathname: newCallbackProtocol.callbackProtocolUrl,
            query: {
              callbackProtocolTitle: newCallbackProtocol.title,
              callbackProtocolDetails: newCallbackProtocol.details,
              callbackProtocolProducts: callbackProtocolProducts,
              callbackProtocolUrl: newCallbackProtocol.callbackProtocolUrl,
            },
          },
          newCallbackProtocol.callbackProtocolUrl
        );
      }
      // Login without callbacks
      else {
        router.push({ pathname: "/" }, "/");
      }
    } else {
      setDisableButton(false);
      setPasswordValidation((state) => ({
        ...state,
        isValid: false,
      }));
    }
  };

  const handleProviderLogin = async () => {
    NProgress.start();
    setLoading(true);
    // setDisableButton(true);

    const providerLogin = await signIn(providers.github.id, {
      // redirect: false,
      callbackUrl: "/",
    });

    // create callBack return to providerLogin
    // if (providerLogin && providerLogin.status === 200) {
    //   router.push("/");
    //   // console.log(providerLogin);
    // } else {
    //   setDisableButton(false);

    // }

    NProgress.done();
    setLoading(false);
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto pb-20 flex flex-col flex-1 bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handleLogin}
            className={`m-auto px-1 container self-center w-full border-black flex flex-col relative ${
              loading ? "opacity-[68%]" : ""
            }`}
          >
            {/* <div className="mx-auto my-8 h-20 w-20 relative">
              <Image
                layout="fill"
                className="border border-black cursor-pointer"
                src="/images/rod_of_asclepius-2.png"
                alt="Home"
                title="Home"
                onClick={() => router.push("/")}
              />
            </div> */}
            <div className="mx-auto rounded-full w-32 h-32 bg-white flex justify-center items-center">
              <Link href={"/"}>
                <div className="mx-auto mt-6 mb-7 h-20 w-20 relative">
                  <Image
                    layout="fill"
                    priority={true}
                    className="border border-black cursor-pointer"
                    src="/images/bacteria-icon.png"
                    alt="logo"
                  />
                </div>
              </Link>
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
                    onClick={() => handleProviderLogin()}
                    className="p-2 my-1.5 w-full bg-zinc-50 rounded text-center border-2 border-gray-400 hover:bg-zinc-100 font-semibold"
                  >
                    Sign in with {providers.github.name}
                  </button>
                </div>
              }
            </div>

            {loading && (
              <div className="absolute flex justify-center items-center mt-5 h-full w-full rounded-md opacity-[100] z-10">
                <TailSpin color="rgb(92, 145, 199)" height={85} width={85} />
              </div>
            )}

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
                autoFocus
                ref={inputEmailElement}
                type="text"
                placeholder="Email"
                value={loginUser.email}
                onChange={(e) => {
                  validatePassword(loginUser.password);
                  validateEmail(e.target.value);
                  setloginUser((state) => ({
                    ...state,
                    email: e.target.value,
                  }));
                }}
                className={`px-4 py-2.5 placeholder-gray-400 text-black bg-white rounded-sm border-b 
                    border-gray-200 shadow-md outline-none focus:outline-none container`}
              />
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="password"
                placeholder="Password"
                value={loginUser.password}
                onChange={(e) => {
                  validateEmail(loginUser.email);
                  validatePassword(e.target.value);
                  setloginUser((state) => ({
                    ...state,
                    password: e.target.value,
                  }));
                }}
                className={`px-4 py-2.5 placeholder-gray-400 text-black 
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
                    icon={faUser}
                    className={`cursor-pointer text-gray-600 hover:text-blue-600`}
                  />
                  <a className="ml-2 text-zinc-800 hover:text-black font-semibold">
                    Create Account
                  </a>
                </div>
              </Link>
              {/* </div> */}
              <div className="inline-block text-zinc-800 hover:text-black text-right">
                <Link href={"/forgot"}>
                  <a>Forgot password?</a>
                </Link>
              </div>
            </div>
            <div className="mt-3 w-full border-black">
              <button
                disabled={disableButton}
                className="px-3 py-1.5 border w-full hover:saturate-[2] text-gray-700 bg-indigo-200 text-lg
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

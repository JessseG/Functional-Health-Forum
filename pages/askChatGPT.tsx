import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Puff } from "react-loader-spinner";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
// import { getProviders, getCsrfToken, useSession } from "next-auth/react";

const AskChatGPT = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const inputEmailElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [forgottenUser, setForgottenUser] = useState({
    email: "",
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isTouched: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [gptSays, setGPTSays] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/");
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

    if (prompt === "") {
        if(disableButton) {
            setDisableButton(false);
        }
        return;
    }

    setLoading(true);
    setDisableButton(true);

    NProgress.start();
    const response = await fetch("/api/ai_tools/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const gptResponse = await response.json().then(async ({data}) => {
      NProgress.done();
      setLoading(false);
      console.log(data);
      setGPTSays(await data?.choices[0]?.text);
      setDisableButton(false);
      return await data;
    });

    // console.log(gptResponse.data);
    

    // if (forgotPassword && forgotPassword.status === "success") {
    //   setForgottenUser((state) => ({
    //     ...state,
    //     email: "",
    //   }));
    //   setEmailSent(true);
    //   setTimeout(async () => {
    //     router.push("/login");
    //   }, 7000);
    // } else {
      // failed, try again
    //   if (forgotPassword && forgotPassword.error === "Invalid email") {
    //     setEmailValidation((state) => ({
    //       ...state,
    //       isValid: false,
    //     }));
    //   }
      // setLoading(false);
      // setDisableButton(false);
    // }
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100 border-red-400">
        <div className="mx-auto my-auto container flex flex-col flex-1 bg-indigo-100 border-indigo-400">
          <form
            onSubmit={handleForgot}
            className={`m-auto pt-14 pb-7 relative container flex flex-col self-center w-full bg-white max-w-[30rem] rounded-lg border-[0.09rem] border-gray-400`}
          >
            {loading && (
              <div className="absolute flex justify-center items-center h-full w-full -translate-y-10 rounded-md opacity-[100] z-10">
                <Puff color="rgb(92, 145, 199)" height={70} width={70} />
              </div>
            )}
            {!emailSent && (
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
                  {/* <div className="mx-auto my-5 h-36 w-36 relative">
                    <Image
                      layout="fill"
                      className="border border-black hue-rotate-[130deg] cursor-pointer saturate-100"
                      src="/images/lock-reset-icon.png"
                      alt="Home"
                      title="Home"
                    />
                  </div> */}
                </Link>

                <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
                  Open-AI GPT3
                </h3>

                <div className="container mt-5">
                  <div className="text-center text-lg- m-0 p-0">
                    Ask Anything
                  </div>
                </div>

                {/* <div
                  className={`mt-5 ring-2 rounded-sm ${
                    formSubmitted && !emailValidation.isValid
                      ? "ring-red-600"
                      : ""
                  }`}
                >
                  <input
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
                    className={`px-3 py-2 placeholder-gray-400 text-black relative w-full
                    bg-white rounded-sm border-b border-gray-200 shadow-md outline-none focus:outline-none container`}
                  />
                </div> */}

                <div className="mt-6">
                  <div className="mx-auto w-full rounded-sm border-blue-300 container border-0 shadow-lg ring-[1.5px] ring-orange-300">
                    <TextareaAutosize
                      onFocus={(e) => {
                        var val = e.target.value;
                        e.target.value = "";
                        e.target.value = val;
                      }}
                      minRows={3}
                      className="text-gray-600 block container text-lg- px-3.5 py-2.5 outline-none no-scroll"
                      placeholder="Ask Anything"
                      value={prompt}
                      onChange={(e) =>
                        setPrompt(e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* <div className="grid">
                  {formSubmitted && !emailValidation.isValid && (
                    <div className="inline-block -mb-3 px-1 mt-2 text-red-600 text-sm justify-self-start">
                      Invalid Email
                    </div>
                  )}
                </div> */}
                
                {/* </div> */}
                <div className="mt-6 w-full border-black flex justify-between">
                  {/* <Link href={"/register"}>
                    <div className="inline-block px-0.5 mt-0.5 text-sky-700 font-semibold text-sm++ justify-self-end underline underline-offset-1 cursor-pointer">
                      Create Account
                    </div>
                  </Link> */}
                  <button
                    disabled={disableButton}
                    type="submit"
                    className="mx-auto w-full py-[0.3rem] border hover:saturate-[2] text-gray-700 bg-indigo-200 text-xl
                    font-semibold border-gray-500 rounded-sm+ outline-none"
                  >
                    Send
                  </button>
                </div>

                {formSubmitted && (
                  <div className="">
                    <div className={`mx-auto px-4 py-3 w-full text-lg- transition-transform duration-[1000ms] rounded-sm border-blue-300 container 
                          border-0 ring-gray-700
                          ${formSubmitted && gptSays !== "" ? `ring-[1.5px] expand-height shadow-lg mt-6` : `min-h-0 ring-0`}`}>
                            {gptSays}
                    </div>
                  </div>
                )}

              </div>
            )}
            {formSubmitted && emailSent && (
              <div>
                <div className="mx-auto bg-indigo-100 rounded-[2rem] mt-4 mb-9 h-44 w-64 relative">
                  <Image
                    layout="fill"
                    className="cursor-pointer"
                    src="/images/email-icon-shrunk.png"
                    alt="Home"
                    title="Home"
                  />
                </div>
                <h3 className="text-2.5xl mt-6 mb-0 font-semibold text-gray-700 text-center">
                  Email Sent!
                </h3>
                <div className="container mt-3 mx-auto">
                  <div className="text-center text-sm+ leading-5 px-12">
                    Please check your email. Your password reset link will be
                    active for 1 hour
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

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//       providers: await getProviders(),
//     },
//   };
// }

export default AskChatGPT;

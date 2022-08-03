import Layout from "../components/Layout";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Puff } from "react-loader-spinner";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { getProviders, getCsrfToken } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";

const Contact = () => {
  const router = useRouter();
  const inputNameElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isTouched: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (!isMobile && inputNameElement.current) {
      inputNameElement.current.focus();
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

  const handleContactSupport = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (
      contact.name === "" ||
      !emailValidation.isValid ||
      contact.message === ""
    ) {
      return;
    }

    setLoading(true);
    setDisableButton(true);

    // api request - send email
    NProgress.start();
    const contactSupport = await fetch("/api/users/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: contact.name,
        email: contact.email.toLowerCase(),
        message: contact.message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    NProgress.done();

    if (contactSupport && contactSupport.status === "success") {
      setContact((state) => ({
        ...state,
        name: "",
        email: "",
        message: "",
      }));

      setLoading(false);
      setEmailSent(true);
      setTimeout(async () => {
        router.push("/");
      }, 7000);
    } else {
      // failed to send contact message for whatever reason, try again
      setDisableButton(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100">
        <div className="mx-auto my-auto container flex flex-col flex-1 bg-indigo-100">
          <form
            onSubmit={handleContactSupport}
            className={`m-auto pt-14 pb-6 relative container self-center -translate-y-3 w-full bg-white max-w-[30rem] rounded-lg border-[0.09rem] border-gray-400`}
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

                <h3 className="text-2.5xl my-5 font-semibold text-gray-700 text-center">
                  Contact Us
                </h3>

                <div className="container mt-5">
                  <div className="text-center">
                    Please enter your message and contact info below
                  </div>
                </div>
                <div
                  className={`mt-6 ring-2 rounded-sm ${
                    formSubmitted &&
                    (contact.name === "" || contact.name == null)
                      ? "ring-red-600"
                      : ""
                  }`}
                >
                  <input
                    autoFocus
                    // onFocus={(e) => {}}
                    ref={inputNameElement}
                    type="text"
                    placeholder="Full Name"
                    value={contact.name}
                    onChange={(e) => {
                      setContact((state) => ({
                        ...state,
                        name: e.target.value,
                      }));
                    }}
                    className={`px-3 py-1.5 placeholder-gray-400 text-black relative w-full
                    bg-white rounded-sm border-b border-gray-200 shadow-md outline-none focus:outline-none container`}
                  />
                </div>

                <div className="grid">
                  {formSubmitted &&
                    (contact.name === "" || contact.name == null) && (
                      <div className="inline-block -mb-2 px-1 mt-2 text-red-600 text-sm justify-self-start">
                        Name required
                      </div>
                    )}
                </div>
                <div
                  className={`mt-5 ring-2 rounded-sm ${
                    formSubmitted && !emailValidation.isValid
                      ? "ring-red-600"
                      : ""
                  }`}
                >
                  <input
                    autoFocus
                    // onFocus={(e) => {}}
                    type="text"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => {
                      validateEmail(e.target.value);
                      setContact((state) => ({
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
                    <div className="inline-block -mb-2 px-1 mt-2 text-red-600 text-sm justify-self-start">
                      Invalid Email
                    </div>
                  )}
                </div>

                <div
                  className={`mt-5 rounded-sm container p-1 shadow-lg ring-2 ${
                    formSubmitted &&
                    (contact.message === "" || contact.message == null)
                      ? "ring-red-600"
                      : ""
                  }`}
                >
                  <TextareaAutosize
                    autoFocus={true}
                    onFocus={(e) => {
                      var val = e.target.value;
                      e.target.value = "";
                      e.target.value = val;
                    }}
                    minRows={3}
                    className="text-gray-600 block container px-3 py-1 outline-none no-scroll"
                    placeholder="Message"
                    value={contact.message}
                    onChange={(e) =>
                      setContact((state) => ({
                        ...state,
                        message: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid">
                  {formSubmitted &&
                    (contact.message === "" || contact.message == null) && (
                      <div className="inline-block -mb-2 px-1 mt-2 text-red-600 text-sm justify-self-start">
                        Message Required
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
                    disabled={disableButton}
                    className="px-3 py-[0.3rem] border hover:saturate-[2] text-gray-700 bg-indigo-200 text-lg
                                font-semibold border-gray-500 rounded-sm+ outline-none"
                    type="submit"
                  >
                    Send
                  </button>
                </div>
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
                  Message Sent!
                </h3>
                <div className="container mt-3 mx-auto">
                  <div className="text-center text-sm+ leading-5 px-12">
                    Someone from our team will be reaching out to you as soon as
                    possible
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

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers: await getProviders(),
    },
  };
}

export default Contact;

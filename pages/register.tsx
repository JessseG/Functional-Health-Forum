import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Puff, TailSpin } from "react-loader-spinner";
import NProgress from "nprogress";
import { useState, useEffect, useRef } from "react";
import { isMobile, isDesktop } from "react-device-detect";
import Select from "react-select";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faHandsHelping,
  faInfo,
  faQuestion,
  faQuestionCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
// import { months } from "moment";

const Register = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const inputNameElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [userNameTaken, setUserNameTaken] = useState(false);
  const [showDateInfobox, setShowDateInfobox] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    dob: {
      month: null,
      day: "",
      year: "",
    },
    password: "",
    confirmPassword: "",
  });
  const [nameValidation, setNameValidation] = useState([
    {
      isTouched: false,
    },
    {
      isTouched: false,
    },
  ]);
  const [emailValidation, setEmailValidation] = useState({
    valid: false,
    isTouched: false,
    userExists: false,
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
  
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const setViewWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", setViewWidth);

    return () => {
      window.removeEventListener("resize", setViewWidth);
    };
  }, []);

  useEffect(() => {
    // console.log("REMOUNT");

    if (session) {
      router.push("/");
    }

    if (!isMobile && inputNameElement.current) {
      inputNameElement.current.focus();
    }
  }, []);

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

  const handleNewUser = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Filter out an empty fields submission.
    if (
      !newUser.name ||
      /^\s*$/.test(newUser.name) ||
      !newUser.email ||
      /^\s*$/.test(newUser.email) ||
      !newUser.username ||
      newUser.username.length < 6 ||
      newUser.username.length > 15 ||
      !newUser.dob.day ||
      !newUser.dob.year ||
      newUser.dob.month === null ||
      0 === parseInt(newUser.dob.day) ||
      31 < parseInt(newUser.dob.day) ||
      parseInt(newUser.dob.year) < 1900 ||
      !validateUserAge13(
        newUser.dob.year,
        newUser.dob.month,
        newUser.dob.day
      ) ||
      new Date().getFullYear() < parseInt(newUser.dob.year) ||
      newUser.password.length < 8 ||
      newUser.confirmPassword.length < 8 ||
      newUser.password !== newUser.confirmPassword
    ) {
      setDisableButton(false);
      return;
    }

    setLoading(true);
    setDisableButton(true);

    // create new pending User locally
    const pUser = {
      name: newUser.name,
      username: newUser.username,
      email: newUser.email.toLowerCase(),
      dobDay: newUser.dob.day,
      dobMonth: newUser.dob.month.value.toString(),
      dobYear: newUser.dob.year,
      password: newUser.password,
      // add collaborator priviledge
    };

    // api request
    NProgress.start();
    const registration = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pUser: pUser }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("registration submitted in register.tsx");
        return data;
      });

    const pwValidation = [...passwordValidation];
    pwValidation[0].isTouched = false;
    pwValidation[1].isTouched = false;
    setPasswordValidation(pwValidation);

    // checks if registration was success or failure
    if (registration) {
      if (registration.status === "success") {
        // On-Screen Visual respresentation of the registration (not backend)
        (document.activeElement as HTMLElement).blur();
        const namValidation = [...nameValidation];
        namValidation[0].isTouched = false;
        namValidation[1].isTouched = false;
        setNameValidation(namValidation);
        setNewUser((state) => ({
          ...state,
          name: "",
          email: "",
          username: "",
          dob: {
            ...state,
            day: "",
            month: null,
            year: "",
          },
          password: "",
          confirmPassword: "",
        }));
        setEmailSent(true);
        setLoading(false);
        setTimeout(async () => {
          router.push("/login");
        }, 7000);
      } else {
        // Failed registration
        console.log(registration);
        console.log(registration.status);

        // Only IF Email is taken
        if (registration.error && registration.error === "Email is taken") {
          setEmailValidation((state) => ({
            ...state,
            userExists: true,
          }));
        }
        if (registration.error && registration.error === "Username is taken") {
          setUserNameTaken(true);
        }
        setLoading(false);
        setDisableButton(false);
        // wipe passwords upon failed registration
        setNewUser((state) => ({
          ...state,
          password: "",
          confirmPassword: "",
        }));
      }
    }

    NProgress.done();

    // router.push(`/communities/${com}`);
  };

  const months = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  const DOB_Months = () => {
    const options = months.map((month, i) => ({
      id: i,
      label: month.name,
      value: i + 1,
    }));
    return options;
  };

  const handleMonth = (option) => {
    setNewUser((state) => ({
      ...state,
      dob: { ...state.dob, month: option },
    }));

    // setNewUser({ ...newUser, [newUser.dob.month.value]: option.value });
  };

  const validateUserAge13 = (year, month, day) => {
    // find the date 13 years ago
    const dateOfBirth = new Date(`${year}-${month.value}-${day}`);
    const date13YrsAgo = new Date();
    date13YrsAgo.setFullYear(date13YrsAgo.getFullYear() - 13);
    // check if the date of birth is before or on that date
    return dateOfBirth <= date13YrsAgo;
  };

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-indigo-100">
        <div className="mx-auto my-auto container flex flex-col flex-1 bg-indigo-100">
          <form
            onSubmit={handleNewUser}
            className={`mx-auto mt-11 pt-8 pb-6 relative container self-center w-full rounded-lg border-gray-400 text-base+ ${
              emailSent && formSubmitted
                ? "max-w-[30rem] mt-32 bg-white border-[0.09rem]"
                : "max-w-[40rem]"
            }`}
          >
            {loading && (
              <div className="absolute flex justify-center items-center h-full w-full -translate-y-28 rounded-md opacity-[100] z-10">
                <TailSpin color="rgb(92, 145, 199)" height={85} width={85} />
              </div>
            )}
            {!emailSent && (
              <div
                className={`${windowWidth <= 450 ? `px-3` : 450 < windowWidth && windowWidth < 600 ? `px-6 max-w-[30rem]` : `px-11 sm:px-14`}  ${loading ? "opacity-[70%]" : ""} mx-auto flex flex-col justify-center`}
              >
                <h3 className="text-2.7xl my-5 font-semibold text-gray-700 text-center">
                  Create New Account
                </h3>

                <div className="mt-10">
                  {/*  New User Name */}
                  <input
                    ref={inputNameElement}
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s'.-]*$/.test(e.target.value)) {
                        const newValidation = [...nameValidation];
                        newValidation[0].isTouched = true;
                        setNameValidation(newValidation);
                        setNewUser((state) => ({
                          ...state,
                          name: e.target.value,
                        }));
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className={`px-3 py-2 w-full placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm
                      border-0 shadow-md outline-none focus:outline-none ${
                        formSubmitted &&
                        (!newUser.name || /^\s*$/.test(newUser.name))
                          ? "ring-red-600"
                          : ""
                      }`}
                  />
                  {formSubmitted &&
                    (!newUser.name || /^\s*$/.test(newUser.name)) && (
                      <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                        Name Required
                      </div>
                    )}
                </div>
                <div className="mt-9.5">
                  <input
                    type="text"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => {
                      if (/\s/g.test(e.target.value)) {
                        e.preventDefault();
                      } else {
                        validateEmail(e.target.value);
                        setEmailValidation((state) => ({
                          ...state,
                          userExists: false,
                          isTouched: true,
                        }));
                        setNewUser((state) => ({
                          ...state,
                          email: e.target.value,
                        }));
                      }
                    }}
                    className={`px-3 py-2 placeholder-gray-400 text-black relative ring-2 
                    bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full
                    ${
                      formSubmitted &&
                      (emailValidation.userExists || !emailValidation.valid)
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                  {(emailValidation.userExists && (
                    <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                      Email is taken
                    </div>
                  )) ||
                    (formSubmitted && !emailValidation.valid && (
                      <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                        Invalid email
                      </div>
                    ))}
                </div>
                <div className="mt-9.5">
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => {
                      if (/^[a-zA-Z0-9._-]*$/.test(e.target.value)) {
                        if (userNameTaken === true) {
                          setUserNameTaken(false);
                        }
                        setNewUser((state) => ({
                          ...state,
                          username: e.target.value,
                        }));
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className={`px-3 py-2 placeholder-gray-400 text-black relative ring-2 
                    bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full
                    ${
                      formSubmitted &&
                      (userNameTaken ||
                        newUser.username === "" ||
                        newUser.username.length < 6 ||
                        newUser.username.length > 15)
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                  {(userNameTaken && (
                    <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                      Username is taken
                    </div>
                  )) ||
                    (formSubmitted &&
                      (newUser.username === "" ||
                        newUser.username.length < 6 ||
                        newUser.username.length > 15) && (
                        <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                          Invalid username
                        </div>
                      ))}
                </div>
                <div className="mt-9.5 flex justify-between">
                  <Select
                    placeholder="Month"
                    className={`px-3 w-11/24 flex flex-row placeholder-gray-800 relative bg-white 
                    rounded-sm border-0 ring-2 shadow-md outline-none ${
                      formSubmitted && newUser.dob.month === null
                        ? "ring-red-600"
                        : ""
                    }`}
                    // tabSelectsValue={false}
                    options={DOB_Months()}
                    value={newUser.dob.month}
                    instanceId="select-dob-month"
                    // isClearable={true}
                    onChange={(option) => {
                      handleMonth(option);
                    }}
                    styles={{
                      control: (base) => ({
                        // outermost container
                        ...base,
                        fontSize: "1.06rem",
                        background: "white",
                        borderRadius: "3px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "none",
                        // padding: "0",
                        // margin: "auto",
                        // border: "1px solid red",
                        width: "100%",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        background: "transparent",
                        // color: "red",
                        width: "100%",
                      }),
                      input: (base) => ({
                        ...base,
                        // color: "none",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "rgb(156 163 175)",
                      }),
                      menu: (base) => ({
                        ...base,
                        // padding: "0rem 1rem 0 1rem",
                        // backgroundColor: "red",
                        width: "85%",
                      }),
                      menuList: (base) => ({
                        ...base,
                        // padding: "0 1rem 0 0",
                        width: "full",
                        border: "1px solid gray",
                        "::-webkit-scrollbar": {
                          width: "0px",
                          height: "0px",
                        },
                        "::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "::-webkit-scrollbar-thumb": {
                          background: "#888",
                        },
                        "::-webkit-scrollbar-thumb:hover": {
                          background: "#555",
                        },
                      }),
                      option: (
                        base,
                        { data, isDisabled, isFocused, isSelected }
                      ) => ({
                        ...base,
                        color: "black",
                        fontSize: "1rem",
                        padding: "0rem 1rem 0 1rem",
                        width: "full",
                        cursor: "pointer",
                        // backgroundColor: isSelected ? "rgb(220, 220, 220)" : "default",
                        // ":hover": {
                        //   backgroundColor: "rgb(220, 220, 220)",
                        // },
                        // backgroundColor: isFocused
                        //   ? "rgb(220, 220, 220)"
                        //   : "white",
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        background: "transparent",
                        padding: "0 0 0 0",
                        margin: "0",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 0,
                        alignSelf: "center",
                        color: "gray",
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        padding: "0",
                        marginRight: "0.4rem",
                        backgroundColor: "transparent",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                    }}
                  />
                  <input
                    maxLength={2}
                    placeholder="Day"
                    value={newUser.dob.day}
                    onChange={(e) => {
                      if (/^[0-9]*$/.test(e.target.value)) {
                        setNewUser((prevState) => ({
                          ...prevState,
                          dob: { ...prevState.dob, day: e.target.value },
                        }));
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className={`px-3 py-2 w-1/5 placeholder-gray-400 text-black relative bg-white
                    rounded-sm border-0 shadow-md outline-none ring-2 ${
                      (formSubmitted && !newUser.dob.day) ||
                      (formSubmitted &&
                        (0 === parseInt(newUser.dob.day) ||
                          31 < parseInt(newUser.dob.day)))
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                  <input
                    maxLength={4}
                    placeholder="Year"
                    value={newUser.dob.year}
                    onChange={(e) => {
                      if (/^[0-9]*$/.test(e.target.value)) {
                        setNewUser((prevState) => ({
                          ...prevState,
                          dob: { ...prevState.dob, year: e.target.value },
                        }));
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className={`px-3 py-2 w-1/4 placeholder-gray-400 text-black relative bg-white
                    rounded-sm border-0 shadow-md outline-none ring-2 ${
                      (formSubmitted && !newUser.dob.year) ||
                      (formSubmitted &&
                        (parseInt(newUser.dob.year) < 1900 ||
                          new Date().getFullYear() <
                            parseInt(newUser.dob.year)))
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                </div>
                {formSubmitted &&
                  (newUser.dob.month === null ||
                    !newUser.dob.day ||
                    !newUser.dob.year ||
                    0 === parseInt(newUser.dob.day) ||
                    31 < parseInt(newUser.dob.day) ||
                    parseInt(newUser.dob.year) < 1900 ||
                    (newUser.dob.year.length === 4 &&
                      newUser.dob.month !== null &&
                      newUser.dob.day.length === 2 &&
                      !validateUserAge13(
                        newUser.dob.year,
                        newUser.dob.month,
                        newUser.dob.day
                      )) ||
                    new Date().getFullYear() < parseInt(newUser.dob.year)) && (
                    <div className="-mb-6.5 border-black flex relative items-center px-3 pt-1 text-red-600 text-sm">
                      Invalid date of birth
                      {newUser.dob.year.length === 4 &&
                        newUser.dob.month !== null &&
                        newUser.dob.day.length === 2 &&
                        !validateUserAge13(
                          newUser.dob.year,
                          newUser.dob.month,
                          newUser.dob.day
                        ) && (
                          <div>
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              className={`ml-2 rounded-full border-black cursor-pointer text-zinc-400 text-[1rem]`}
                              onMouseEnter={() => setShowDateInfobox(true)}
                              onMouseLeave={() => setShowDateInfobox(false)}
                            />
                            <span
                              className={`${
                                showDateInfobox ? "" : "hidden"
                              } absolute mt-1 ml-0.5 w-1/2 z-10 bg-white opacity-[98%] border border-gray-500 pl-4 pr-2.5 py-3 rounded-sm+ text-gray-600`}
                            >
                              Per our terms of service, users must be at least
                              13 years of age to have an account and use
                              Healwell
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                <div className="mt-9.5">
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => {
                      if (!passwordValidation[0].isTouched) {
                        const newValidation = [...passwordValidation];
                        newValidation[0].isTouched = true;
                        setPasswordValidation(newValidation);
                      }
                      setNewUser((state) => ({
                        ...state,
                        password: e.target.value,
                      }));
                    }}
                    className={`px-3 py-2 placeholder-gray-400 text-black relative 
                    bg-white rounded-sm border-0 shadow-md outline-none ring-2
                    focus:outline-none w-full ${
                      (passwordValidation[0].isTouched &&
                        newUser.password.length < 8) ||
                      (formSubmitted && newUser.password.length < 8)
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                  {(passwordValidation[0].isTouched &&
                    newUser.password.length < 8 && (
                      <div className="-mb-6.5 px-3 pt-1 text-red-600 text-sm">
                        {passwordValidation[0].message}
                      </div>
                    )) ||
                    (formSubmitted && newUser.password.length < 8 && (
                      <div className="-mb-6.5 px-3 pt-1 text-red-600 text-sm">
                        {passwordValidation[0].message}
                      </div>
                    ))}
                </div>
                <div className="mt-9.5">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={newUser.confirmPassword}
                    onChange={(e) => {
                      if (!passwordValidation[1].isTouched) {
                        const newValidation = [...passwordValidation];
                        newValidation[1].isTouched = true;
                        setPasswordValidation(newValidation);
                      }
                      setNewUser((state) => ({
                        ...state,
                        confirmPassword: e.target.value,
                      }));
                    }}
                    className={`px-3 py-2 placeholder-gray-400 text-black relative ring-2
                    bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full
                ${
                  (newUser.password !== newUser.confirmPassword &&
                    passwordValidation[1].isTouched) ||
                  (formSubmitted && !newUser.confirmPassword)
                    ? "ring-red-600"
                    : ""
                }`}
                  />
                  {newUser.password !== newUser.confirmPassword &&
                    passwordValidation[1].isTouched && (
                      <div className="-mb-6.5 px-3 pt-1 text-red-600 text-sm">
                        {passwordValidation[1].message}
                      </div>
                    )}
                </div>
                <div className="mt-10 w-full border-black">
                  <button
                    disabled={disableButton}
                    className="px-3 py-1.5 border w-full hover:saturate-[2] text-gray-700 bg-indigo-200 text-xl
                    font-semibold border-gray-500 rounded-sm outline-none"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
            {formSubmitted && emailSent && (
              <div
              // className="m-auto -translate-y-20 pt-14 pb-7 container self-center w-full bg-white max-w-[30rem] rounded-lg border-[0.09rem] border-indigo-300 saturate-[1.5]"
              >
                <div className="mx-auto bg-indigo-100 rounded-[2rem] mt-6 mb-9 h-44 w-64 relative">
                  <Image
                    layout="fill"
                    className="cursor-pointer"
                    src="/images/email-icon-shrunk.png"
                    alt="Home"
                    title="Home"
                  />
                </div>
                <h3 className="text-2.5xl mt-5 mb-0 font-semibold text-gray-700 text-center">
                  Email Sent!
                </h3>
                <div className="container mt-3 mx-auto">
                  <div className="text-center text-sm+ leading-5 px-12">
                    Check your email. Your account's activation link will be
                    active for 24 hours
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

export default Register;

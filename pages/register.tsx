import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import NProgress from "nprogress";
import { CSSProperties, useState } from "react";
import { months } from "moment";
import Select from "react-select";

const Register = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [state, setState] = useState();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
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

  const handleNewUser = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Filter out an empty fields submission.
    if (
      !newUser.name ||
      /^\s*$/.test(newUser.name) ||
      !newUser.email ||
      /^\s*$/.test(newUser.email) ||
      !newUser.dob.day ||
      !newUser.dob.year ||
      newUser.dob.month === null ||
      0 === parseInt(newUser.dob.day) ||
      31 < parseInt(newUser.dob.day) ||
      parseInt(newUser.dob.year) < 1900 ||
      new Date().getFullYear() < parseInt(newUser.dob.year) ||
      newUser.password.length < 8 ||
      newUser.confirmPassword.length < 8 ||
      newUser.password !== newUser.confirmPassword
    ) {
      return;
    }
    // create new pending User locally
    const pUser = {
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      dobDay: newUser.dob.day,
      dobMonth: newUser.dob.month.value,
      dobYear: newUser.dob.year,
      password: newUser.password,
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
        return data;
      });

    const pwValidation = [...passwordValidation];
    pwValidation[0].isTouched = false;
    pwValidation[1].isTouched = false;
    setPasswordValidation(pwValidation);

    // checks if registration was success or failure
    if (registration.status === "failure") {
      // console.log(registration);
      setEmailValidation((state) => ({
        ...state,
        userExists: true,
      }));
      setNewUser((state) => ({
        ...state,
        password: "",
        confirmPassword: "",
      }));
    } else if (registration.status === "success") {
      // console.log(registration);
      (document.activeElement as HTMLElement).blur();
      setFormSubmitted(false);
      const namValidation = [...nameValidation];
      namValidation[0].isTouched = false;
      namValidation[1].isTouched = false;
      setNameValidation(namValidation);
      setNewUser((state) => ({
        ...state,
        name: "",
        email: "",
        dob: {
          ...state,
          day: "",
          month: null,
          year: "",
        },
        password: "",
        confirmPassword: "",
      }));
    }

    NProgress.done();

    // router.push(`/communities/${sub}`);
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
      value: month.name,
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

  // <div>Log In to use this feature</div>
  // <button onClick={() => handleLogin()}>Login</button>
  // <button onClick={() => router.back()}>Go Back</button>

  return (
    <Layout>
      <div className="mx-auto flex flex-col flex-1 w-full bg-indigo-100 border-red-600">
        <div className="mx-auto px-8 flex flex-col flex-1 w-fit bg-indigo-100 border-red-600">
          <form
            onSubmit={handleNewUser}
            className="mx-auto my-12 self-center container w-full flex-1 border-black text-base+"
          >
            <h3 className="text-2.5xl my-4 font-semibold text-gray-700 text-center">
              Register New User
            </h3>
            <div className="mt-9">
              {/*  New User Name */}
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => {
                  const newValidation = [...nameValidation];
                  newValidation[0].isTouched = true;
                  setNameValidation(newValidation);
                  setNewUser((state) => ({
                    ...state,
                    name: e.target.value,
                  }));
                }}
                className={`px-3 py-2 vvv w-full placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm
                 border-0 shadow-md outline-none focus:outline-none ${
                   (formSubmitted && !newUser.name) ||
                   (formSubmitted && /^\s*$/.test(newUser.name))
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
                // autoFocus={}
                // onFocus={(e) => {}}
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
                className={`px-3 py-2 vvv placeholder-gray-400 text-black relative ring-2 
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
            <div className="mt-9.5 flex justify-between">
              <Select
                placeholder="Month"
                className={`px-3 w-11/24 flex flex-row placeholder-gray-800 relative bg-white 
                rounded-sm ring-2 shadow-md outline-none ${
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
                    outline: "transparent",
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
                  option: (base) => ({
                    ...base,
                    color: "black",
                    fontSize: "1rem",
                    padding: "0rem 1rem 0 1rem",
                    background: "white",
                    width: "full",
                    ":hover": {
                      backgroundColor: "rgb(190, 190, 190)",
                      // color: "red",
                    },
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
                // autoFocus={}
                // onFocus={(e) => {}}
                maxLength={2}
                placeholder="Day"
                value={newUser.dob.day}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  if (!/[0-9]/.test(e.target.value)) {
                    e.preventDefault();
                  } else {
                    setNewUser((prevState) => ({
                      ...prevState,
                      dob: { ...prevState.dob, day: e.target.value },
                    }));
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
                // autoFocus={}
                // onFocus={(e) => {}}
                maxLength={4}
                placeholder="Year"
                value={newUser.dob.year}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  if (!/[0-9]/.test(e.target.value)) {
                    e.preventDefault();
                  } else {
                    setNewUser((prevState) => ({
                      ...prevState,
                      dob: { ...prevState.dob, year: e.target.value },
                    }));
                  }
                }}
                className={`px-3 py-2 w-1/4 placeholder-gray-400 text-black relative bg-white
                 rounded-sm border-0 shadow-md outline-none ring-2 ${
                   (formSubmitted && !newUser.dob.year) ||
                   (formSubmitted &&
                     (parseInt(newUser.dob.year) < 1900 ||
                       new Date().getFullYear() < parseInt(newUser.dob.year)))
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
                new Date().getFullYear() < parseInt(newUser.dob.year)) && (
                <div className="-mb-6.5 px-3 pt-1 text-red-600 text-sm">
                  Invalid date of birth
                </div>
              )}
            <div className="mt-9.5">
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
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
                className={`px-3 py-2 vvv placeholder-gray-400 text-black relative 
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
                // autoFocus={}
                // onFocus={(e) => {}}
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
                className={`px-3 py-2 vvv placeholder-gray-400 text-black relative ring-2
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
                className="px-3 py-1.5 border w-full hover:bg-indigo-300 text-gray-700 bg-indigo-200 text-lg
               font-semibold border-gray-500 rounded-sm outline-none"
                type="submit"
              >
                Register
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

export default Register;

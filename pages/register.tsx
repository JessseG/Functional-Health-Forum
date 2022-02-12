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
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    dob: { month: "", day: "", year: "" },
    password: "",
    confirmPassword: "",
  });
  const [userExists, setUserExists] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");

  // const handleLogin = async () => {
  //   router.back();
  //   signIn();
  //   // this order cause next-auth redirects to main page
  // };

  if (session) {
    router.push("/");
  }

  const handleNewPost = async (e) => {
    e.preventDefault();

    // create new pending User locally
    const user = {
      name: newUser.name,
      email: newUser.email,
    };

    // api request
    NProgress.start();
    const registration = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    if (registration.message) {
      console.log(registration);
      setUserExists(!userExists);
    } else if (registration.email) {
      console.log(registration);
      setNewUser((state) => ({
        ...state,
        email: "",
        name: "",
      }));
    }

    NProgress.done();

    // router.push(`/communities/${sub}`);
  };

  const months = [
    { name: "January", disabled: false },
    { name: "February", disabled: false },
    { name: "March", disabled: false },
    { name: "April", disabled: false },
    { name: "May", disabled: false },
    { name: "June", disabled: false },
    { name: "July", disabled: false },
    { name: "August", disabled: false },
    { name: "September", disabled: false },
    { name: "October", disabled: false },
    { name: "November", disabled: false },
    { name: "December", disabled: false },
  ];
  const DOB_Months = () => {
    // let options = months.map((month, index) => (
    //   <option value={month.name} disabled={month.disabled} key={index}>
    //     {month.name}
    //   </option>
    // ));
    // return options;

    let options = [
      <option value="" key={0} disabled>
        Month
      </option>,
    ];

    for (let i = 1; i <= months.length; i++) {
      options.push(
        <option value={months[i]?.name} key={i}>
          {months[i]?.name}
        </option>
      );
    }
    return options;
  };

  const DOB_Months2 = () => {
    // if (!data) return;

    // react-select requires this structure
    const options = months.map((month, i) => ({
      id: i,
      label: month.name,
      value: month.name,
    }));
    // options.reverse();
    // console.log(options);
    return options;
  };

  const checkPasswords = () => {
    // let validity = {};

    if (newUser.password.length <= 6) {
      setPasswordValid(false);
      setPasswordValidation("Password must have at least 7 characters");
    } else if (newUser.password !== newUser.confirmPassword) {
      setPasswordValid(false);
      setPasswordValidation("Passwords do not match");
    } else {
      setPasswordValid(true);
    }
  };

  // <div>Log In to use this feature</div>
  // <button onClick={() => handleLogin()}>Login</button>
  // <button onClick={() => router.back()}>Go Back</button>

  return (
    <Layout>
      <div className="mx-auto w-9/12 sm:w-8/12 md:w-7/12 md:max-w-prose lg:w-5/12 xl:w-4/12 mt-8 pb-6 border border-black">
        <form
          onSubmit={handleNewPost}
          className="mx-auto h-full w-8/12 border-black flex flex-col"
        >
          <div className="flex-1 border-black">
            <h3 className="text-xl my-7 font-semibold text-gray-700 text-center">
              Register New User
            </h3>

            <div className="mt-5 flex justify-between">
              {/*  New User Name */}
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((state) => ({
                    ...state,
                    name: e.target.value,
                  }))
                }
                required
                className={`px-3 py-1.5 w-full placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none`}
              />
              {/* <input
                type="text"
                placeholder="Last Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((state) => ({
                    ...state,
                    name: e.target.value,
                  }))
                }
                required
                className={`px-3 py-1.5 inline-block w-1/2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none`}
              /> */}
            </div>
            <div className="mt-5">
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => {
                  setUserExists(false);
                  setNewUser((state) => ({
                    ...state,
                    email: e.target.value,
                  }));
                }}
                className={`px-3 py-1.5 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
              {userExists && (
                <div className="px-3 pt-1.5 text-red-600 text-sm">
                  Email is taken
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-between">
              <Select
                placeholder="Month"
                className="px-3 w-11/24 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm shadow-md outline-none"
                options={DOB_Months2()}
                instanceId="select-dob-month"
                onChange={(option) => {
                  console.log(option.label);
                  // router.push(`/communities/${option.value}`);
                }}
                styles={{
                  control: (base) => ({
                    // outermost container
                    ...base,
                    fontSize: "1rem",
                    background: "white",
                    borderRadius: "3px",
                    border: "none",
                    cursor: "pointer",
                    outline: "transparent",
                    boxShadow: "none",
                    padding: "0",
                    margin: "0",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0",
                    background: "transparent",
                    outline: "none",
                    border: "none",
                    margin: "0",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    background: "transparent",
                    padding: "0",
                    display: "flex",
                    width: "100%",
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

              {/* <select
                // autoFocus={}
                // onFocus={(e) => {}}
                placeholder="Month"
                value={newUser.dob.month}
                onChange={(e) => {
                  setNewUser((prevState) => ({
                    ...prevState,
                    dob: { ...prevState.dob, month: e.target.value },
                  }));
                }}
                required
                className={`px-3 py-1.5 w-1/2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none`}
              >
                {DOB_Months()} */}
              {/* {months.map((month, index) => (
                  <option value={month} key={index}>
                    {month}
                  </option>
                ))} */}
              {/* </select> */}
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
                  setNewUser((prevState) => ({
                    ...prevState,
                    dob: { ...prevState.dob, day: e.target.value },
                  }));
                }}
                className={`px-3 py-1.5 w-1/5 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none`}
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
                  setNewUser((prevState) => ({
                    ...prevState,
                    dob: { ...prevState.dob, year: e.target.value },
                  }));
                }}
                className={`px-3 py-1.5 w-1/4 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none`}
              />
            </div>
            <div className="mt-5">
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => {
                  setNewUser((state) => ({
                    ...state,
                    password: e.target.value,
                  }));
                  checkPasswords();
                }}
                className={`px-3 py-1.5 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
            </div>
            <div className="mt-5">
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="password"
                placeholder="Confirm Password"
                value={newUser.confirmPassword}
                onChange={(e) => {
                  setNewUser((state) => ({
                    ...state,
                    confirmPassword: e.target.value,
                  }));
                  checkPasswords();
                }}
                className={`px-3 py-1.5 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
              {!passwordValid && (
                <div className="px-3 pt-1.5 text-red-600 text-sm">
                  {/* {passwordValidation} => ERRORS => ONE STEP BEHIND */}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 w-full border border-black">
            <button
              className="px-3 border-2 w-full hover:bg-green-300 text-black bg-indigo-200 text-base+ font-semibold border-gray-300 rounded-sm outline-none"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <div className="bg-red-600 sm:bg-yellow-500 md:bg-green-400 lg:bg-blue-600 xl:bg-purple-500 2xl:bg-pink-600">
        Size
      </div>
    </Layout>
  );
};

export default Register;

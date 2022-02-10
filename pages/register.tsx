import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import NProgress from "nprogress";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [userExists, setUserExists] = useState(false);

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

  // <div>Log In to use this feature</div>
  // <button onClick={() => handleLogin()}>Login</button>
  // <button onClick={() => router.back()}>Go Back</button>

  return (
    <Layout>
      <div className="mx-auto w-8/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 mt-8 pb-6 border border-black">
        <form
          onSubmit={handleNewPost}
          className="mx-auto h-full w-8/12 border-black flex flex-col"
        >
          <div className="flex-1 border-black">
            <h3 className="text-xl my-5 font-semibold text-gray-700 text-center">
              Register New User
            </h3>

            <div className="mb-3">
              {/*  New User Name */}
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((state) => ({
                    ...state,
                    name: e.target.value,
                  }))
                }
                required
                className={`autoFocus px-3 py-2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
            </div>
            <div className="mt-2">
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
                className={`autoFocus px-3 py-2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
              {userExists && (
                <div className="px-3 pt-1.5 text-red-600 text-sm">
                  Email is taken
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                // autoFocus={}
                // onFocus={(e) => {}}
                type="text"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => {
                  setNewUser((state) => ({
                    ...state,
                    address: e.target.value,
                  }));
                }}
                className={`autoFocus px-3 py-2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
            </div>
            <div className="mt-2">
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
                }}
                className={`autoFocus px-3 py-2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
            </div>
            <div className="mt-2">
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
                }}
                className={`autoFocus px-3 py-2 placeholder-gray-400 text-black relative ring-2 bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none w-full`}
              />
            </div>
          </div>
          <div className="mt-3 w-full border border-black">
            <button
              className="px-3 border-2 w-full hover:bg-green-300 text-black bg-indigo-200 text-base+ font-semibold border-gray-300 rounded-sm outline-none"
              type="submit"
            >
              Register
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

export default Register;

import React from "react";
import Layout from "../components/Layout";
import Nav from "../components/Nav";
import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { data, error } = useSWR("/api/community/allCommunities", fetchData);

  const router = useRouter();

  // console.log("index session", session);

  // return (
  //   <Layout>
  //     <div className="mx-auto px-5 h-full flex flex-col w-full overflow-y-auto overflow-x-auto no-scroll">
  //       <div className="">
  //         {!session && (
  //           <>
  //             <div className="inline-block mx-8 mt-5 border text-white bg-gray-600 text-lg border-gray-800 rounded px-3 py-1 outline-none">
  //               Not signed in
  //             </div>
  //             <br />
  //             <button
  //               onClick={() => signIn()}
  //               className="inline-block mx-8 mt-5 border text-white bg-yellow-800 text-lg border-gray-800 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-yellow-900"
  //             >
  //               Sign in
  //             </button>
  //           </>
  //         )}
  //         {session && (
  //           <>
  //             <div className="inline-block mx-8 mt-5 border text-white bg-gray-600 text-lg border-gray-800 rounded px-3 py-1 outline-none">
  //               Signed in as {session.user.name || session.user.email}
  //             </div>
  //             <br />
  //             <button
  //               onClick={() => signOut()}
  //               className="inline-block mx-8 mt-5 border text-white bg-yellow-800 text-lg border-gray-800 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-yellow-900"
  //             >
  //               Sign out
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </Layout>
  // );

  const convertComs = () => {
    if (!data) return;

    // react-select requires this structure
    const options = data.map((com) => ({
      id: com.id,
      label: com.displayName,
      value: com.name,
    }));
    options.sort((a, b) => a.label.localeCompare(b.label));
    // console.log(options);
    return options;
  };

  const showOptionsBar = (e) => {
    return;
  };

  return (
    <Layout>
      <div className="mx-auto flex flex-col flex-1 w-full">
        {/* <Nav /> */}
        {/* BODY    - bg-center (closes view from right to left)*/}
        <div className="bg-zinc-200 mx-auto flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/health_connections.jpeg')]">
          <div className="w-fit max-w-xl">
            {/* INTRO MESSAGE */}
            <div className="rounded mx-14 mt-14 mb-1 py-2 text-3xl font-semibold text-indigo-100 border-white">
              Learn about the latest in health & supplements people are sharing
            </div>

            {/* FEATURES LIST */}
            <div className="mx-14 mt-0 mb-3 px-8 py-2 text-white rounded-sm">
              <div className="underline underline-offset-2 text-lg mb-1.5 text-sky-200 -ml-2 tracking-wide">
                Features
              </div>
              <ul className="list-disc text-base+">
                <li>Crowd-sourced forum data on various health topics</li>
                <li>User's Reviews of the best selection of supplements</li>
                <li>
                  User can provide, rate, and review Recovery Protocols for a
                  wide variety of health conditions
                </li>
                <li>
                  Facilitated access to user-rated and reviewed functional
                  medicine practitioners online or nearby
                </li>
                <li>
                  Users can compare their medical test results and symptoms to
                  other users' anonymous test results for a wide varity of
                  functional medical tests
                </li>
              </ul>
            </div>

            {/* GET STARTED */}
            <div className="border border-purple-800 mx-16 h-12 bg-orange-400 rounded cursor-pointer hover:border-zinc-400">
              <Link href={"/register"}>
                <div className="text-zinc-50 text-xl text-center leading-12 font-semibold hover:text-xxl hover:text-white">
                  Get Started
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

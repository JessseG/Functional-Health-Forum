import Link from "next/link";
import Select, { components } from "react-select";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Nav = (props) => {
  // const [session, loading] = useSession();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  // const [communities, setCommunities] = useState([]);
  const { data: communities, error } = useSWR(
    "/api/community/allCommunities",
    fetchData
  );

  const router = useRouter();

  // // This fetch calls on the 'allCommunities.ts' API to request the list of the community names
  // const fetchData = async () => {
  //   const res = await fetch("/api/community/allCommunities");
  //   const coms = await res.json();
  //   console.log("fetchData");
  //   setCommunities(coms);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // below were called community (not data) along with the commented useState()
  const convertComs = () => {
    if (!communities) {
      return <div>ERROR</div>;
    }

    // console.log(communities);

    // react-select requires this structure
    try {
      const options = communities?.map((com) => ({
        id: com.id,
        value: com.name,
        label: com.displayName,
        icon: "caret-up-solid.svg",
      }));
      options?.sort((a, b) => a.label.localeCompare(b.label));
      // options.reverse();
      // console.log(options);
      return options;
    } catch (e) {
      console.log(e);
    }
  };

  const showOptionsBar = async (e) => {
    props.openSidebar();
    return;
  };

  return (
    <nav className="relative flex items-center justify-between py-0 bg-white border-b-3 border-gray-700">
      <div className="flex items-center border-black">
        <Link href="/" as="">
          {/* <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" /> */}
          <div className="ml-8 mr-6 sm:ml-4 md:ml-9 lg:ml-18 my-3 py-0.5 relative border-indigo-600 h-13 w-13">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/bacteria-icon.png"
              alt="logo"
            />
          </div>
        </Link>

        <Link href="/" as="">
          <div className="hidden sm:block ml-3.5 mr-4 my-3 relative border-indigo-600 h-10.5 w-44">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/heal-well-cursive-logo.png"
              alt="title"
            />
          </div>
        </Link>
        {/* <Link href="/"> */}
        {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            HealWell
          </a> */}
        {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Healnow
          </a> */}
        {/* <a className="text-gray-700 text-2.2xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Heal Right
          </a> */}
        {/* <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            Healgood
          </a> */}
        {/* <a className="text-gray-700 text-2.2xl font-bold ml-1 hidden outline-none md:block hover:text-indigo-600">
            HealBright
          </a> */}
        {/* </Link> */}
      </div>
      <div className="w-7/12 sm:w-5/12 max-w-xl w-full md:mr-0 outline-none border border-gray-600 rounded">
        <Select
          instanceId="select"
          options={convertComs()}
          onChange={(option) => {
            // console.log(value.label);
            router.push(`/communities/${option.value}`);
          }}
        />
      </div>

      {/* {session?.user?.email && (
        <div className="cursor-pointer font-semibold hidden md:block -mb-1">
          <FontAwesomeIcon
            icon={faUser}
            className={`hidden ${
              session?.user?.email ? "inline-block" : ""
            } cursor-pointer text-gray-600 text-[1.58rem] hover:text-rose-400`}
            onClick={(e) => showOptionsBar(e)}
          />
          <span className="ml-3.5 text-lg+">
            {loading ? "" : session?.user?.name}
          </span>
        </div>
      )} */}

      <div className="border-red-600 h-18 ml-0 md:w-24 lg:w-44 xl:w-52 2xl:w-72 flex justify-end">
        <div className="hidden w-16 sm:block text-gray-700 font-bold ml-4 mr-3 text-lg hover:text-indigo-200 text-center self-center">
          {!session && <button onClick={() => signIn()}>Login</button>}
        </div>
        <div
          className={`ml-6 mr-6 flex text-gray-700 hover:text-indigo-200 border-black`}
        >
          <FontAwesomeIcon
            icon={faBars}
            className={`cursor-pointer self-center text-gray-800 options-bars hover:text-red-500`}
            onClick={(e) => showOptionsBar(e)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;

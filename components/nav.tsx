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

export default function Nav(props) {
  // const [session, loading] = useSession();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  // const [subReddits, setSubreddits] = useState([]);
  const { data, error } = useSWR("/api/subreddit/allSubreddits", fetchData);

  const router = useRouter();

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // This fetch calls on the 'allSubreddits.ts' API to request the list of the subreddit names
  // const fetchData = async () => {
  //   const res = await fetch("/api/subreddit/allSubreddits");
  //   const subreddits = await res.json();
  //   setSubreddits(subreddits);
  // };

  // below were called subreddit (not data) along with the commented useState()

  const convertSubs = () => {
    if (!data) {
      return <div>ERROR</div>;
    }

    // react-select requires this structure
    const options = data.map((sub) => ({
      id: sub.id,
      label: sub.displayName,
      value: sub.name,
      icon: "caret-up-solid.svg",
    }));
    options.sort((a, b) => a.label.localeCompare(b.label));
    // options.reverse();
    // console.log(options);
    return options;
  };

  const showOptionsBar = (e) => {
    props.openSidebar();
    return;
  };

  return (
    <nav className="relative flex items-center justify-between py-0 bg-white border-b-3 border-gray-700">
      <div className="flex items-center">
        <Link href="/">
          {/* <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" /> */}
          <div className="ml-4 md:ml-9 lg:ml-18 my-3 py-0.5 relative border-indigo-600 h-13 w-13">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/bacteria-icon.png"
              alt="Rod of Asclepius"
            />
          </div>
        </Link>

        <Link href="/">
          <div className="ml-3.5 mr-4 my-3 relative border-indigo-600 h-10.5 w-44">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/heal-well-cursive-logo.png"
              alt="Rod of Asclepius"
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
      <div className="md:w-1/3 w-full mr-4 md:mr-0 outline-none">
        <Select
          instanceId="select"
          options={convertSubs()}
          onChange={(option) => {
            // console.log(value.label);
            router.push(`/communities/${option.value}`);
          }}
        />
      </div>

      {session?.user?.email && (
        <div className="cursor-pointer font-semibold hidden md:block -mb-1">
          {/* <FontAwesomeIcon
            icon={faUser}
            className={`hidden ${
              session?.user?.email ? "inline-block" : ""
            } cursor-pointer text-gray-600 text-[1.58rem] hover:text-rose-400`}
            onClick={(e) => showOptionsBar(e)}
          /> */}
          {/* <span className="ml-3.5 text-lg+">
            {loading ? "" : session?.user?.name}
          </span> */}
        </div>
      )}
      <div className="hidden md:block text-gray-700 font-bold mr-4 text-lg hover:text-indigo-200">
        {!session && <button onClick={() => signIn()}>Login</button>}
      </div>
      {session && (
        <div className="block ml-2 mr-6 text-gray-700 hover:text-indigo-200">
          <FontAwesomeIcon
            icon={faBars}
            className={`cursor-pointer text-gray-800 options-bars hover:text-red-500`}
            onClick={(e) => showOptionsBar(e)}
          />
        </div>
      )}
    </nav>
  );
}

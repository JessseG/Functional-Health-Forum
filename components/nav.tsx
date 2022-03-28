import Link from "next/link";
import Select, { components } from "react-select";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import { faBars } from "@fortawesome/free-solid-svg-icons";
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
    if (!data) return;

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
          <div className="rounded-full border-2 relative border-indigo-600 mx-7 mt-2 mb-3 p-0 h-14 w-14 rotate-45">
            <Image
              layout="fill"
              className="border border-black -rotate-45 cursor-pointer"
              src="/images/rod_of_asclepius-2.png"
              alt="Rod of Asclepius"
            />
          </div>
        </Link>
        <Link href="/">
          <a className="text-gray-700 text-2.5xl font-bold ml-1 hidden md:block hover:text-indigo-600">
            Asclepius
          </a>
        </Link>
      </div>
      <div className="md:w-1/3 w-full mr-4 md:mr-0">
        <Select
          instanceId="select"
          options={convertSubs()}
          onChange={(option) => {
            // console.log(value.label);
            router.push(`/communities/${option.value}`);
          }}
        />
      </div>

      <h3 className="text-gray-600 font-semibold text-lg hidden md:block">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="hidden md:block text-gray-700 font-bold mr-4 text-lg hover:text-indigo-200">
        {!session && <button onClick={() => signIn()}>Login</button>}
        {session && (
          <button
            onClick={() => {
              router.push("/");
              signOut();
            }}
          >
            Logout
          </button>
        )}
      </div>
      <div className="block md:hidden ml-2 mr-6 text-gray-700 hover:text-indigo-200">
        <FontAwesomeIcon
          icon={faBars}
          className={`cursor-pointer text-gray-800 options-bars hover:text-red-500`}
          onClick={(e) => showOptionsBar(e)}
        />
      </div>
    </nav>
  );
}

import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut, options } from "next-auth/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// import { asclep1 } from "./images/rod_of_asclepius.png";

export default function Nav() {
  const [session, loading] = useSession();
  const [subReddits, setSubreddits] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  // This fetch calls on the 'allSubreddits.ts' API to request the list of the subreddit names
  const fetchData = async () => {
    const res = await fetch("/api/subreddit/allSubreddits");
    const subreddits = await res.json();
    setSubreddits(subreddits);
  };

  const convertSubs = () => {
    if (subReddits.length < 1) return;

    // react-select requires this structure
    const options = subReddits.map((sub) => ({
      id: sub.id,
      label: sub.displayName,
      value: sub.name,
    }));
    options.reverse();
    // console.log(options);
    return options;
  };

  return (
    <nav className="flex items-center justify-between py-0 bg-white border-b-3 border-gray-700">
      <div className="flex items-center">
        <Link href="/">
          {/* <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" /> */}
          <div className="rounded-tl-2xl border-2 border-indigo-600 mx-7 mt-2 mb-3 p-0 h-11 w-11 rotate-45">
            <Image
              layout="fill"
              className="border border-black -rotate-45"
              src="/images/rod_of_asclepius-2.png"
              alt="me"
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
            router.push(`/subreddits/${option.value}`);
          }}
        />
      </div>

      <h3 className="text-gray-600 font-semibold text-lg hidden md:block">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="text-gray-700 font-bold mr-4 text-lg hover:text-indigo-200">
        {!session && <button onClick={() => signIn}>Login</button>}
        {session && <button onClick={() => signOut}>Logout</button>}
      </div>
    </nav>
  );
}

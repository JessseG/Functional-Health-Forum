import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut } from "next-auth/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Nav() {
  const [session, loading] = useSession();
  const [subReddits, setSubreddits] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const convertSubs = () => {
    if (subReddits.length < 1) return;

    const options = subReddits.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
    return options;
  };

  const fetchData = async () => {
    const res = await fetch("/api/subreddit/allSubreddits");
    const subreddits = await res.json();
    setSubreddits(subreddits);
  };

  return (
    <nav className="flex items-center justify-between py-4 bg-gray-700">
      <div className="flex items-center">
        <Link href="/">
          <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" />
        </Link>
        <Link href="/">
          <a className="text-white text-2xl font-bold ml-16 hidden md:block hover:text-indigo-200">
            Reddit
          </a>
        </Link>
      </div>
      <div className="md:w-1/3 w-full mr-4 md:mr-0">
        <Select
          options={convertSubs()}
          onChange={(option) => {
            router.push(`/subreddits/${option.label}`);
          }}
        />
      </div>

      <h3 className="text-white font-bold text-xl hidden md:block">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="text-white font-bold mr-4 text-xl hover:text-indigo-200">
        {!session && <button onClick={() => signIn}>Login</button>}
        {session && <button onClick={() => signOut}>Logout</button>}
      </div>
    </nav>
  );
}

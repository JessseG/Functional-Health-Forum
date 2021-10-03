import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Layout from "../components/Layout";

export default function Page() {
  const [session, loading] = useSession();

  return (
    <Layout>
      {!session && (
        <>
          <div className="inline-block mx-8 mt-5 border text-white bg-gray-600 text-lg border-gray-800 rounded px-3 py-1 outline-none">
            Not signed in
          </div>
          <br />
          <button
            onClick={() => signIn()}
            className="inline-block mx-8 mt-5 border text-white bg-yellow-800 text-lg border-gray-800 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-yellow-900"
          >
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          <div className="inline-block mx-8 mt-5 border text-white bg-gray-600 text-lg border-gray-800 rounded px-3 py-1 outline-none">
            Signed in as {session.user.name}
          </div>
          <br />
          <button
            onClick={() => signOut()}
            className="inline-block mx-8 mt-5 border text-white bg-yellow-800 text-lg border-gray-800 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-yellow-900"
          >
            Sign out
          </button>
        </>
      )}
    </Layout>
  );
}

import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const checkEmail = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      router.push("/login");
    }, 4500);
  }, []);

  return (
    <Layout>
      <div className="block fixed h-full z-10 w-full bg-indigo-100 flex flex-col items-center">
        <div className="py-0 my-auto">
          <div className="mx-auto rounded-full w-32 h-32 bg-white">
            <div className="mx-auto -mt-32 mb-6 h-20 w-20 relative translate-y-6">
              <Image
                layout="fill"
                priority={true}
                className="border border-black cursor-pointer"
                src="/images/bacteria-icon.png"
                alt="logo"
              />
            </div>
          </div>
          <div className="flex flex-col items-center mx-auto mt-5 pl-11 pr-9 py-5 container max-w-[340px] bg-zinc-50 border-2 border-indigo-300 rounded-md">
            <div className="mx-auto my-auto">
              <div className="text-xxl font-semibold text-stone-800 border-gray-700">
                Email Sent!
              </div>
              {/* <div className="mt-4 pt-0.5 text-base+ font-semibold text-purple-700"></div> */}
              <div className="mt-5 text-sm+ font-semibold text-red-700">
                Please check your email. The link will be active for 24 hours.
              </div>

              {/* Please check your email to verify your account. The link will be
                active for 24 hours. */}

              {/* After 24 hours, the link will no longer
              work and the pending user email will be released */}
            </div>
          </div>
        </div>

        {/* <div className="w-full h-32 py-3 inline-block font-semibold text-lg bg-white sm:bg-yellow-300 md:bg-yellow-600 lg:bg-red-500 xl:bg-purple-700 2xl:bg-blue-600 rounded-md shadow-sm hover:shadow-xl outline-none focus:outline-none">
          HHH
        </div> */}
      </div>
    </Layout>
  );
};

export default checkEmail;

import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useEffect } from "react";

const checkEmail = () => {
    
    const router = useRouter();

    useEffect(() => {
        setTimeout(async() => {
            router.push('/login');
        }, 6000);
    },[]);
    
  return (
    <Layout>
        <div className="block fixed h-full z-10 w-full bg-indigo-100 flex items-center">
            <div className="flex flex-col items-center mx-auto my-auto px-12 -translate-y-32 w-9/12 sm:w-8/12 md:w-13/24 lg:w-5/12 xl:w-1/3 2xl:w-9/32 max-h-[20%] min-h-[15%] bg-zinc-50 border-2 border-fuchsia-300 rounded-md">
                <div className="mx-auto my-auto">
                    <div className="text-xxl font-semibold text-stone-800 border-gray-700">
                        Email Sent!
                    </div>
                    <div className="mt-3 pt-0.5 text-base+ font-semibold text-purple-800">
                        Check your email to verify the account. The link will be active for 24 hours
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  );

};

export default checkEmail;
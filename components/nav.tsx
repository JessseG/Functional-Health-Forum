import Link from "next/link";
import Select, { components } from "react-select";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import {
  faBars,
  faPlus,
  faPlusSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import NProgress from "nprogress";
import Modal from "./Modal";

const Nav = ({ toggleSidebar, hideLogin }) => {
  // const [session, loading] = useSession();
  const modalRef = useRef(null);
  const { data: session, status } = useSession();
  const loading = status === "loading";
  // const [communities, setCommunities] = useState([]);
  const { data: communities, error }: any = useSWR(
    "/api/community/allCommunities",
    fetchData
  );
  // const [newCommunity, setCommunity] = useState({
    //   displayName: null,
    //   infoBoxText: null,
    //   name: null,
    // });
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const setViewWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", setViewWidth);

    return () => {
      window.removeEventListener("resize", setViewWidth);
    };
  }, []);

  const router = useRouter();

  // if (!communities) {
  //   return <div>ERROR</div>;
  // }

  // below were called community (not data) along with the commented useState()
  const convertComs = () => {
    // react-select requires this structure
    try {
      const options = communities?.map((com) => ({
        id: com.id,
        value: com.name,
        label: com.displayName,
        icon: "caret-up-solid.svg",
      }));
      options?.sort((a, b) => a.label.localeCompare(b.label));
      return options;
    } catch (e) {
      // console.log(e);
    }
  };

  const showOptionsBar = async (e) => {
    toggleSidebar();
    return;
  };

  const handleCreateCommunity = async (e: any) => {
    const selection = await modalRef.current.handleModal(
      "create community",
      null,
      null
    );

    // DO SOME NAME EDITIING FOR NAME VS displayNAME

    if (selection && selection.selection === "Create") {
      const newCom = {
        displayName: selection.communityName,
        infoBoxText: selection.communityDescription,
        name: selection.communityName,
      };

      NProgress.start();
      await fetch("/api/community/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCom: newCom }),
      }).then(() => {
        // setDisableClick(false);
      });
      NProgress.done();
    }
  };

  return (
    <nav className="relative flex items-center justify-between py-0 bg-zinc-50 border-b-3 border-gray-700">
      <Modal
        ref={modalRef}
        // showModal={showModal}
        // modalMode={modalMode}
        // shareLink={""}
        // closeDownModal={closeDownModal}
        // handleModalPromise={handleModalPromise}
      />
      {/* <div className="flex justify-center items-center border-black">
        <Link href="/" as="/">
          <div className="hidden sm:block ml-8 md:ml-9 lg:ml-18 mr-6 my-3 py-0.5 relative border-indigo-600 h-13 w-13">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/bacteria-icon.png"
              alt="logo"
            />
          </div>
        </Link>

        <Link href="/" as="/">
          <div className="ml-8 mr-6 my-3 relative border-indigo-600 h-10.5 w-44">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/heal-well-cursive-logo.png"
              alt="title"
            />
          </div>
        </Link>
      </div> */}
      <div className="flex justify-center items-center border-black">
        <Link href="/" as="/">
          <div className="ml-8 md:ml-9 lg:ml-18 mr-6 my-3 py-0.5 relative border-indigo-600 h-13 w-13">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/bacteria-icon.png"
              alt="logo"
            />
          </div>
        </Link>

        <Link href="/" as="/">
          <div className="hidden sm:block mr-6 lg:ml-4 my-3 relative border-indigo-600 h-10.5 w-44">
            <Image
              layout="fill"
              priority={true}
              className="border border-black cursor-pointer"
              src="/images/healwell-cursive-logo.png"
              alt="title"
            />
          </div>
        </Link>
      </div>

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

      <div className="w-7/12 sm:w-5/12 max-w-xl w-full flex items-center outline-none border border-gray-600 rounded">
        <Select
          instanceId="select"
          className="inline-block w-full border-r border-gray-400"
          options={convertComs()}
          onChange={(option) => {
            // console.log(value.label);
            router.push(`/communities/${option.value}`);
          }}
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "3px 0px 0px 3px",
              border: "none",
            }),
            valueContainer: (base) => ({
              ...base,
              paddingLeft: "0.6rem",
            }),
          }}
        />
        <div 
          title="Create New Community"
          className="hover:bg-orange-300 pl-[0.21rem] pr-0.5" >
          <FontAwesomeIcon
            icon={faPlus}
            className={`p-2 text-[1.4rem] text-teal-900 cursor-pointer rounded-sm`}
            onClick={(e) => handleCreateCommunity(e)}
          />
        </div>
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

      <div className="border-red-600 h-18 flex justify-between 2xl:ml-24">
        {!hideLogin && (
          <div className="hidden w-16 sm:block border-black ml-8 font-bold text-center self-center">
            {!session && (
              <button
                onClick={() => signIn()}
                className="text-lg text-gray-800 hover:text-purple-800 hover:saturate-[2]"
              >
                Login
              </button>
            )}
          </div>
        )}
        <div
          className={`flex text-gray-700 hover:text-indigo-200 border-black ${windowWidth < 430 ? `ml-7 mr-6` : `ml-8 mr-7`}`}
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

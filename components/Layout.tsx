import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import Nav from "./nav";
import Community from "../pages/communities/[com]/index";
import Modal from "./Modal";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const ModalDeletedContext = createContext<Function | null>(null);

export const useModalContext = () => {
  return useContext(ModalDeletedContext);
};

const Layout = ({ children }) => {
  // 'children' refers to the entire content within <Layout></Layout> TAGS
  const [deleted, setDeleted] = useState("null");
  const [showSidebar, setShowSidebar] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const router = useRouter();
  const showNav = router.pathname === "/login" ? false : true;

  const [modal, setModal] = useState({
    display: "hidden",
    background: "opacity-100",
  });

  const openModal = () => {
    setModal((state) => ({
      ...state,
      display: "block",
      background: "opacity-50",
    }));
  };

  const closeModal = () => {
    setModal((state) => ({
      ...state,
      display: "hidden",
      background: "opacity-100",
    }));
  };

  const myPromiseGenerator = async (cancelBtn, deleteBtn) => {
    return new Promise((resolve, reject) => {
      cancelBtn.addEventListener(
        "click",
        function (e) {
          resolve(e.target.innerText);
        },
        { once: true }
      );
      deleteBtn.addEventListener(
        "click",
        function (e) {
          resolve(e.target.innerText);
        },
        { once: true }
      );
    });
  };

  const handleModal = async () => {
    openModal();

    var deleteBtn = document.getElementById("delete-btn");
    var cancelBtn = document.getElementById("cancel-btn");

    const response = await myPromiseGenerator(cancelBtn, deleteBtn);
    closeModal();
    return response;
  };

  const openSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // useRef to toggle MODAL
  return (
    <ModalDeletedContext.Provider value={handleModal}>
      <div
        className={`${modal.display} fixed h-full z-10 w-full border-yellow-400 flex items-center`}
      >
        <div className="px-5 py-2.5 w-9/12 sm:w-8/12 md:w-13/24 lg:w-5/12 xl:w-1/3 2xl:w-9/32 bg-white rounded-md mx-auto border-3 border-gray-500">
          <div className="ml-3 mt-5 text-xl font-semibold">Delete Post</div>
          <hr className="mx-2 my-2 h-0.5 mt-4 bg-gray-300" />
          <div className="ml-5 mt-3 text-lg">
            Are you sure you want to delete this post?
          </div>
          <hr className="mx-2 my-3 h-0.5 bg-gray-300" />
          <div className="flex mt-3 mr-1.5 justify-end border-red-500">
            <button
              id="delete-btn"
              className="border text-white bg-red-700 text-lg border-gray-500 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-red-800"
            >
              Delete
            </button>
            <button
              id="cancel-btn"
              onClick={closeModal}
              className="ml-2 border text-white bg-gray-600 text-lg border-gray-700 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* <Modal dimBackground={dimBackground} /> */}
      <div
        className={`flex flex-col bg-gray-500 border-yellow-400 w-full flex-1 duration-500 ease-in-out ${
          modal.background
        } ${showSidebar ? "custom-shift" : ""}`}
      >
        {showNav && <Nav openSidebar={openSidebar} />}
        {/* INDEX - Com Communities */}
        <div className="flex flex-col bg-zinc-300 border-emerald-400 w-full flex-1 overflow-hidden">
          {children}
        </div>
      </div>
      <div
        className={`-right-40 py-4 fixed z-10 duration-500 ease-in-out flex flex-col flex-1 h-full bg-zinc-700 w-0 border-2 border-red-400 ${
          showSidebar ? "-translate-x-40 w-40" : "translate-x-40"
        }`}
      >
        <ul className="text-lg w-full text-gray-300 grid content-between flex flex-col flex-1 mr-1.5">
          <div className="self-start text-center mx-auto w-full">
            <div title="Profile Feature coming soon">
              <FontAwesomeIcon
                icon={faUser}
                className={`mt-4 mb-2 cursor-pointer text-gray-600 text-[1.58rem] hover:text-rose-400 bg-emerald-200 border px-2.5 py-2 rounded-full`}
              />
            </div>

            <div className="mx-auto mb-3 text-lg+ max-w-[60%] no-scroll">
              {loading ? "" : session?.user?.name.split(" ")[0]}
            </div>
            {session && (
              <div>
                <hr className="w-5/6 border mx-auto mb-3 border-gray-300" />
                <li
                  className="cursor-pointer text-center my-2 text-gray-500"
                  title="Profile Feature coming soon"
                >
                  Profile
                </li>
                <hr className="w-5/6 mx-auto border-gray-500" />
                <li
                  className="cursor-pointer text-center my-2 text-gray-500"
                  title="Create Community Feature coming soon"
                >
                  Create
                </li>
              </div>
            )}
            <hr className="w-5/6 mx-auto border-gray-500" />
            <Link href={"/contact"}>
              <li className="cursor-pointer text-center my-2 hover:text-white">
                Contact
              </li>
            </Link>
            <hr className="w-5/6 mx-auto border-gray-500" />
            <li
              className="cursor-pointer text-center my-2 text-gray-500"
              title="Settings Feature coming soon"
            >
              Settings
            </li>
            <hr className="w-5/6 mx-auto border-gray-500" />
          </div>
          <div className="self-end mx-auto w-full">
            {/* <hr className="w-5/6 mx-auto border-gray-500" /> */}
            <li className="cursor-pointer text-center my-2 hover:text-white">
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
            </li>
          </div>
        </ul>
      </div>
    </ModalDeletedContext.Provider>
  );
};

export default Layout;

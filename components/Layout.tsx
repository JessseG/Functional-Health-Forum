import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import Nav from "./nav";
import SubReddit from "../pages/communities/[sub]/index";
import Modal from "./Modal";
import { useRouter } from "next/router";

export const ModalDeletedContext = createContext<Function | null>(null);

export const useModalContext = () => {
  return useContext(ModalDeletedContext);
};

const Layout = ({ children }) => {
  // 'children' refers to the entire content within <Layout></Layout> TAGS
  const [deleted, setDeleted] = useState("null");
  const [showSidebar, setShowSidebar] = useState(false);

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
        className={`flex flex-col bg-gray-500 border-yellow-400 w-full flex-1 ${modal.background}`}
      >
        {showNav && <Nav openSidebar={openSidebar} />}
        {/* INDEX - Sub Communities */}
        <div className="flex flex-col bg-purple-300 border-emerald-400 w-full flex-1 overflow-hidden">
          <div
            className={`-right-40 pl-12 pr-8 py-4 fixed z-10 transition ease duration-500 ease-in-out flex-1 bg-zinc-700 w-0 ${
              showSidebar ? "-translate-x-40 w-40" : "translate-x-40"
            }`}
          >
            <ul className="text-lg text-gray-300 flex flex-col flex-1 bg-red-300">
              <div className="self-start">
                <li className="cursor-pointer mt-3">Profile</li>
                <li className="cursor-pointer mt-3">Login</li>
                <li className="cursor-pointer mt-3">Contact</li>
              </div>
              <div className="self-end">
                <li className="cursor-pointer mt-3">Settings</li>
              </div>
            </ul>
          </div>
          {children}
        </div>
      </div>
    </ModalDeletedContext.Provider>
  );
};

export default Layout;

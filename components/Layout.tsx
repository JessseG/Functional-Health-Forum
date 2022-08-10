import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import Nav from "./nav";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  faBox,
  faCopy,
  faExternalLink,
  faUser,
  faX,
  faXmark,
  faXRay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { isMobile, isDesktop } from "react-device-detect";
import { redirect } from "next/dist/server/api-utils";

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
  const [minSmallScreen, setMinSmallScreen] = useState(null);
  const [minPhoneScreen, setMinPhoneScreen] = useState(null);
  const [hideLoginLimit, setHideLoginLimit] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copiedLinkBtn, setCopiedLinkBtn] = useState(false);
  const modalRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const router = useRouter();
  const showNav = router.pathname === "/login" ? false : true;

  useEffect(() => {
    const mediaQuery0 = window.matchMedia("(min-width: 460px)");
    setMinPhoneScreen(mediaQuery0.matches);

    const mediaQuery1 = window.matchMedia("(min-width: 640px)");
    setMinSmallScreen(mediaQuery1.matches);

    const mediaQuery2 = window.matchMedia("(max-width: 840px)");
    setHideLoginLimit(mediaQuery2.matches);

    const matchMediaQuery0 = () => {
      setMinPhoneScreen(mediaQuery0.matches);
    };
    const matchMediaQuery1 = () => {
      setMinSmallScreen(mediaQuery1.matches);
    };
    const matchMediaQuery2 = () => {
      setHideLoginLimit(mediaQuery2.matches);
    };

    mediaQuery0.addEventListener("change", matchMediaQuery0);
    mediaQuery1.addEventListener("change", matchMediaQuery1);
    mediaQuery2.addEventListener("change", matchMediaQuery2);

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mediaQuery0.removeEventListener("change", matchMediaQuery0);
      mediaQuery1.removeEventListener("change", matchMediaQuery1);
      mediaQuery2.removeEventListener("change", matchMediaQuery2);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

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
      cancelBtn.current.addEventListener(
        "click",
        (e) => {
          resolve(e.target.innerText);
        },
        { once: true }
      );
      deleteBtn.current.addEventListener(
        "click",
        (e) => {
          resolve(e.target.innerText);
        },
        { once: true }
      );
    });
  };

  const handleModal = async (mode, link) => {
    openModal();

    setModalMode(mode);

    if (mode === "share") {
      setShareLink(link);
    } else {
      if (
        deleteButtonRef !== null &&
        deleteButtonRef.current !== null &&
        cancelButtonRef !== null &&
        cancelButtonRef.current !== null
      ) {
        const response = await myPromiseGenerator(
          cancelButtonRef,
          deleteButtonRef
        );

        closeModal();

        return response;
      }
    }
  };

  const openSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  // useRef to toggle MODAL
  return (
    <ModalDeletedContext.Provider value={handleModal}>
      <div
        className={`${modal.display} fixed h-full z-10 w-full border-yellow-400 flex justify-center items-center`}
      >
        <div
          ref={modalRef}
          className="relative container mx-7 px-4 py-2.5 bg-white max-w-[30rem] rounded-md border-3 border-gray-500"
        >
          {/* <div className=""> */}
          <div
            className={`mt-4 text-xl font-semibold flex flex-row justify-between ${
              modalMode === "share" ? "ml-4 pl-0.5" : "ml-3"
            }`}
          >
            <span>
              {modalMode === "delete"
                ? "Delete Post"
                : modalMode === "share"
                ? "Share Post"
                : ""}
            </span>

            {modalMode === "share" && (
              <span
                className="-mt-1 mr-1.5 border-black"
                onClick={() => closeModal()}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className={`text-[1.15rem] px-1.5 py-0.5 saturate-[1.2] cursor-pointer text-gray-900 border-black rounded-sm+ hover:text-orange-600`}
                  // icon={faExternalLink}
                  // className={`mt-4 mb-2 cursor-pointer text-white text-[1.58rem] hover:text-rose-400 bg-gray-700 border px-2 py-2 rounded-full`}
                />
              </span>
            )}
          </div>
          {modalMode === "delete" && (
            <div>
              <hr className="mx-2 mb-1 h-0.5 mt-4 bg-gray-300" />
              <div className="ml-5 mt-3 text-lg">
                Are you sure you want to delete this post?
              </div>
            </div>
          )}
          {modalMode === "share" && (
            <div>
              <hr className="mx-2 mb-1 h-0.5 mt-3 bg-gray-300" />
              <div className="mx-auto px-4 mt-5 mb-3 flex items-center justify-between">
                <input
                  readOnly
                  className={`pl-2.5 pr-1 bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm+ ${
                    copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"
                  }`}
                  value={shareLink}
                  onKeyPress={(e) => e.preventDefault()}
                />
                <button
                  className={`ml-3 px-2.5 pt-1 pb-1 relative hover:saturate-[1] text-white text-base+ rounded-sm+ border border-gray-500 copy-button ${
                    copiedLinkBtn ? "bg-indigo-400" : "bg-indigo-500"
                  }`}
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setCopiedLinkBtn(true);
                  }}
                  // onKeyPress={() => setCopiedLinkBtnColor("green")}
                >
                  {minPhoneScreen && (
                    <div>{copiedLinkBtn ? "Copied" : "Copy"}</div>
                  )}
                  {!minPhoneScreen && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className={`text-lg cursor-pointer text-white hover:text-orange-600`}
                      // icon={faExternalLink}
                      // className={`mt-4 mb-2 cursor-pointer text-white text-[1.58rem] hover:text-rose-400 bg-gray-700 border px-2 py-2 rounded-full`}
                    />
                  )}
                </button>
              </div>
              {/* <hr className="mx-2 mb-1 h-0.5 mt-4 mb-5 bg-gray-300" /> */}
            </div>
          )}
          {modalMode === "delete" && (
            <div>
              <hr className="mx-2 my-3 h-0.5 bg-gray-300" />
              <div className="flex mt-3 mr-1.5 justify-end border-red-500">
                <button
                  ref={deleteButtonRef}
                  id="delete-btn"
                  className="border text-white bg-red-700 text-lg border-gray-500 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-red-800"
                >
                  Delete
                </button>
                <button
                  ref={cancelButtonRef}
                  id="cancel-btn"
                  onClick={closeModal}
                  className="ml-2 border text-white bg-gray-600 text-lg border-gray-700 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* </div> */}
        </div>
      </div>
      {/* <Modal dimBackground={dimBackground} /> */}
      <div
        className={`flex flex-col bg-gray-500 border-yellow-400 w-full flex-1 duration-500 ease-in-out ${
          modal.background
        } ${showSidebar ? "custom-shift" : ""}`}
      >
        {showNav && (
          <Nav
            openSidebar={openSidebar}
            hideLogin={showSidebar && minSmallScreen && hideLoginLimit}
          />
        )}
        {/* INDEX - Com Communities */}
        <div className="flex flex-col bg-zinc-300 border-emerald-400 w-full flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`-right-40 fixed z-10 duration-500 ease-in-out flex flex-col flex-1 h-full bg-zinc-700 w-0 border-2 border-purple-300 saturate-[2] ${
          showSidebar ? "-translate-x-40 w-40" : "translate-x-40"
        } ${
          !session &&
          !(
            isMobile ||
            !minSmallScreen ||
            (showSidebar && minSmallScreen && hideLoginLimit)
          )
            ? "pt-2 pb-4"
            : "py-4"
        }`}
      >
        <ul className="text-lg w-full text-gray-300 grid content-between flex flex-col flex-1 mr-1.5">
          <div className="self-start text-center mx-auto w-full">
            {!session &&
              (isMobile ||
                !minSmallScreen ||
                (showSidebar && minSmallScreen && hideLoginLimit)) && (
                <Link href={"/login"}>
                  <div>
                    <li
                      className="cursor-pointer text-center mt-1.5 mb-3.5 saturate-[0.93] text-purple-300 hover:saturate-[1.5]"
                      title="Profile Feature coming soon"
                    >
                      Login
                    </li>
                    <hr className="w-5/6 mx-auto border-gray-500" />
                  </div>
                </Link>
              )}

            {session && (
              <div>
                <div title="Profile Feature coming soon">
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`mt-4 mb-2 cursor-pointer text-gray-600 text-[1.58rem] hover:text-rose-400 bg-emerald-200 border px-2.5 py-2 rounded-full`}
                  />
                </div>

                <div className="mx-auto mb-3 text-lg+ max-w-[60%] no-scroll">
                  {loading ? "" : session?.user?.name.split(" ")[0]}
                </div>
                <div>
                  <hr className="w-5/6 mx-auto mb-3 border-gray-300" />
                  <li
                    className="cursor-pointer text-center mx-2 py-1 my-1 text-gray-500"
                    title="Profile Feature coming soon"
                  >
                    Profile
                  </li>
                  <hr className="w-5/6 mx-auto border-gray-500" />
                  <li
                    className="cursor-pointer text-center mx-2 py-1 my-1 text-gray-500"
                    title="Create Community Feature coming soon"
                  >
                    Create
                  </li>
                  <hr className="w-5/6 mx-auto border-gray-500" />
                </div>
              </div>
            )}

            <Link href={"/contact"}>
              <li
                className={`cursor-pointer mx-2 text-center hover:text-white ${
                  !session &&
                  !(
                    isMobile ||
                    !minSmallScreen ||
                    (showSidebar && minSmallScreen && hideLoginLimit)
                  )
                    ? "pt-3.5 pb-3.5"
                    : "my-1 py-1"
                }`}
              >
                Contact
              </li>
            </Link>
            <hr className="w-5/6 mx-auto border-gray-500" />
            {!session && (
              <Link href={"/register"}>
                <div>
                  <li className="cursor-pointer text-center mx-2 py-1 my-1 text-gray-300 hover:text-white">
                    Sign Up
                  </li>
                  <hr className="w-5/6 mx-auto border-gray-500" />
                </div>
              </Link>
            )}
            <li
              className="cursor-pointer text-center mx-2 py-1 my-1 text-gray-500"
              title="Settings Feature coming soon"
            >
              Settings
            </li>
            <hr className="w-5/6 mx-auto border-gray-500" />
          </div>

          <div className="self-end mx-auto w-full">
            {/* <hr className="w-5/6 mx-auto border-gray-500" /> */}
            <li className="cursor-pointer  text-center mx-2 py-1 my-1 hover:text-white">
              {session && (
                <button onClick={() => handleSignOut()}>Logout</button>
              )}
            </li>
          </div>
        </ul>
      </div>
    </ModalDeletedContext.Provider>
  );
};

export default Layout;

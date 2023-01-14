import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBoltLightning,
  faBox,
  faCircleExclamation,
  faCopy,
  faExclamation,
  faExternalLink,
  faPaperPlane,
  faUser,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSession } from "next-auth/react";
import NProgress from "nprogress";

const Modal = forwardRef((props, ref) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const accessCodeInputEditRef = useRef(null);
  const accessCodeInputDeleteRef = useRef(null);
  const emailInputRef = useRef(null);
  const quickPostRef = useRef(null);
  const sendQuickPostRef = useRef(null);
  const loginPostRef = useRef(null);
  const editButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const cancelEditButtonRef = useRef(null);
  const cancelDeleteButtonRef = useRef(null);
  const newCommunityNameInputRef = useRef(null);
  const newCommunityDescriptionInputRef = useRef(null);
  const createNewCommunityBtnRef = useRef(null);
  const [modalMode, setModalMode] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [createMode, setCreateMode] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [validAccessCode, setValidAccessCode] = useState(false);
  const [accessEmail, setAccessEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [showCreateCommunityModal, setShowCreateCommunityModal] =
    useState(true);
  const [showShareModal, setShowShareModal] = useState(true);
  const [showEditModal, setShowEditModal] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(true);
  const [modalStyle, setModalStyle] = useState({
    display: "hidden",
    background: "opacity-100",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedLinkBtn, setCopiedLinkBtn] = useState(false);
  const [minPhoneScreen, setMinPhoneScreen] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const { data: session, status } = useSession();
  const selectedOptionRef = useRef("");
  selectedOptionRef.current = selectedOption;

  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const updateScreenWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  });

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (modalRef.current && !modalRef.current.contains(e.target)) {
  //       closeModal();
  //     }
  //   };

  //   // Bind the event listener
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [modalRef]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 460px)");
    setMinPhoneScreen(mediaQuery.matches);

    const matchMediaQuery = () => {
      setMinPhoneScreen(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", matchMediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", matchMediaQuery);
    };
  });

  const openModal = () => {
    setModalStyle((state) => ({
      ...state,
      display: "block",
      background: "opacity-50",
    }));
  };

  const closeModal = () => {
    setModalStyle((state) => ({
      ...state,
      display: "hidden",
      background: "opacity-100",
    }));
  };

  const createCommunityPromiseGenerator = async (
    createNewCommunityBtnRef,
    backdropReff,
    modalReff
  ) => {
    return new Promise<any>((resolve, reject) => {
      createNewCommunityBtnRef.current.addEventListener(
        "click",
        function handler(e) {
          setFormSubmitted(true);
          if (
            newCommunityNameInputRef.current.value !== "" &&
            newCommunityDescriptionInputRef.current.value !== ""
          ) {
            this.removeEventListener("click", handler);
            resolve({
              selection: "Create",
              communityName: newCommunityNameInputRef.current.value,
              communityDescription:
                newCommunityDescriptionInputRef.current.value,
            });
          }
        }
      );

      backdropReff.current.addEventListener("click", function handler(e) {
        if (modalReff.current && !modalReff.current.contains(e.target)) {
          this.removeEventListener("click", handler);
          resolve({
            selection: "Cancel",
          });
        }
      });
    });
  };

  const createPromiseGenerator = async (
    sendQuickRef,
    loginOptionRef,
    backdropReff,
    modalReff
  ) => {
    return new Promise<any>((resolve, reject) => {
      sendQuickRef.current.addEventListener("click", function handler(e) {
        setFormSubmitted(true);
        if (
          validateEmail(emailInputRef.current.value) &&
          selectedOptionRef.current === "quickPost"
        ) {
          this.removeEventListener("click", handler);
          resolve({
            selection: "Quick",
            email: emailInputRef.current.value,
          });
        }
      });

      loginOptionRef.current.addEventListener(
        "click",
        async (e: any) => {
          resolve({
            selection: "Login",
          });
        },
        { once: true }
      );

      backdropReff.current.addEventListener("click", function handler(e) {
        if (modalReff.current && !modalReff.current.contains(e.target)) {
          this.removeEventListener("click", handler);
          resolve({
            selection: "Cancel",
          });
        }
      });
    });
  };

  const deletePromiseGenerator = async (
    deleteBtn,
    cancelBtn,
    backdrop,
    modalBox,
    id?,
    mode?
  ) => {
    const splitMode = mode.split(" ");
    var type = splitMode[1]; // post or protocol
    if (!session) {
      setTimeout(() => {
        accessCodeInputDeleteRef.current.focus(); // not working
      }, 20);
    }
    return new Promise((resolve, reject) => {
      if (session) {
        deleteBtn.current.addEventListener(
          "click",
          async (e: any) => {
            resolve(e.target.innerText);
          },
          { once: true }
        );
      } else {
        deleteBtn.current.addEventListener("click", async function handler(e) {
          setFormSubmitted(true);
          if (
            await validateAccessCode(
              id,
              accessCodeInputDeleteRef.current.value,
              type,
              splitMode[0]
            )
          ) {
            this.removeEventListener("click", handler);
            resolve(e.target.innerText);
          }
        });
      }
      cancelBtn.current.addEventListener(
        "click",
        async (e: any) => {
          resolve(e.target.innerText);
        },
        { once: true }
      );

      backdrop.current.addEventListener("click", function handler(e) {
        if (modalBox.current && !modalBox.current.contains(e.target)) {
          this.removeEventListener("click", handler);
          resolve("Clicked Outside");
        }
      });
    });
  };

  const editPromiseGenerator = async (
    editBtn,
    cancelBtn,
    backdrop,
    modalBox,
    id?,
    mode?
  ) => {
    const splitMode = mode.split(" ");
    var type = splitMode[1];
    if (!session) {
      setTimeout(() => {
        accessCodeInputEditRef.current.focus(); // not working
      }, 20);
    }
    return new Promise((resolve, reject) => {
      editBtn.current.addEventListener("click", async function handler(e) {
        setFormSubmitted(true);
        if (
          await validateAccessCode(
            id,
            accessCodeInputEditRef.current.value,
            type,
            splitMode[0]
          )
        ) {
          this.removeEventListener("click", handler);
          resolve(e.target.innerText);
        }
      });

      cancelBtn.current.addEventListener(
        "click",
        async (e: any) => {
          resolve(e.target.innerText);
        },
        { once: true }
      );

      backdrop.current.addEventListener("click", function handler(e) {
        if (modalBox.current && !modalBox.current.contains(e.target)) {
          this.removeEventListener("click", handler);
          resolve("Clicked Outside");
        }
      });
    });
  };

  const validateAccessCode = async (
    id: string,
    accessCode: string,
    type: string,
    mode: string
  ) => {
    NProgress.start();

    const trimmedAccessCode = accessCode.trimStart().trimEnd();

    const valid = await fetch(`/api/${type}s/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessCode: trimmedAccessCode, id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    if (!valid) {
      if (mode === "edit") {
        accessCodeInputEditRef.current.focus();
      } else if (mode === "delete") {
        accessCodeInputDeleteRef.current.focus();
      }
    }

    NProgress.done();
    setValidAccessCode(valid);
    return valid;
  };

  useImperativeHandle(ref, () => ({
    handleModal: async (
      mode: string,
      link?: string,
      id?: string
    ): Promise<any> => {
      openModal();
      setModalMode(mode);

      if (mode.includes("share")) {
        setShowShareModal(true);
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShareLink(link);

        backdropRef.current.addEventListener("click", function handler(e) {
          if (modalRef.current && !modalRef.current.contains(e.target)) {
            this.removeEventListener("click", handler);
            setShowShareModal(false);
            closeModal();
          }
        });
      } else if (mode.includes("create community")) {
        setShowCreateCommunityModal(true);
        setShowCreateModal(false);
        setShowShareModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setCreateMode(mode.split(" ")[1]);

        if (
          newCommunityNameInputRef &&
          newCommunityNameInputRef.current &&
          createNewCommunityBtnRef &&
          createNewCommunityBtnRef.current &&
          backdropRef &&
          backdropRef.current &&
          modalRef &&
          modalRef.current
        ) {
          const response = await createCommunityPromiseGenerator(
            createNewCommunityBtnRef,
            backdropRef,
            modalRef
          );

          console.log(response);

          if (response.selection === "Create") {
            setNewCommunityName("");
            setNewCommunityDescription("");
            setShowCreateCommunityModal(false);
          }

          setFormSubmitted(false);
          closeModal();
          return response;
        }
      } else if (mode.includes("create")) {
        setShowCreateModal(true);
        setShowShareModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setCreateMode(mode.split(" ")[1]);

        if (
          emailInputRef &&
          emailInputRef.current &&
          sendQuickPostRef &&
          sendQuickPostRef.current &&
          loginPostRef &&
          loginPostRef.current &&
          backdropRef &&
          backdropRef.current &&
          modalRef &&
          modalRef.current
        ) {
          const response = await createPromiseGenerator(
            sendQuickPostRef,
            loginPostRef,
            backdropRef,
            modalRef
          );

          // console.log(response);

          if (response.selection === "Quick") {
            setAccessEmail("");
            setSelectedOption("");
            setShowCreateModal(false);
          }

          setFormSubmitted(false);
          closeModal();
          return response;
        }
      } else if (mode.includes("edit")) {
        setShowEditModal(true);
        setShowCreateModal(false);
        setShowShareModal(false);
        setShowDeleteModal(false);

        if (
          accessCodeInputEditRef &&
          accessCodeInputEditRef.current &&
          editButtonRef &&
          editButtonRef.current &&
          cancelEditButtonRef &&
          cancelEditButtonRef.current
        ) {
          const response = await editPromiseGenerator(
            editButtonRef,
            cancelEditButtonRef,
            backdropRef,
            modalRef,
            id,
            mode
          );

          if (response === "Edit") {
            setAccessCode("");
            setShowEditModal(false);
          }

          setFormSubmitted(false);
          closeModal();

          return String(response);
        }
      } else if (mode.includes("delete")) {
        setShowDeleteModal(true);
        setShowCreateModal(false);
        setShowShareModal(false);
        setShowEditModal(false);

        if (
          accessCodeInputEditRef &&
          accessCodeInputEditRef.current &&
          deleteButtonRef &&
          deleteButtonRef.current &&
          cancelDeleteButtonRef &&
          cancelDeleteButtonRef.current
        ) {
          const response = await deletePromiseGenerator(
            deleteButtonRef,
            cancelDeleteButtonRef,
            backdropRef,
            modalRef,
            id,
            mode
          );

          if (response === "Delete") {
            setAccessCode("");
            setShowDeleteModal(false);
          }

          setFormSubmitted(false);
          closeModal();

          return String(response);
        }
      }
    },
  }));

  const validateEmail = (email: string) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regexp.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  const handleCreate = () => {
    setFormSubmitted(true);
    if (!validateEmail(accessEmail)) {
      return;
    } else {
    }

    setCopiedLinkBtn(true);
  };

  return (
    // BACKDROP
    <div
      ref={backdropRef}
      className={`${modalStyle.display} fixed m-auto top-0 right-0 bottom-0 left-0 h-[100%] w-[100%] z-10 bg-black bg-opacity-[35%]`}
      // ref={innerRef}
    >
      {/* EXTRA CONTAINER? */}
      <div
        className={`fixed h-full z-10 w-full border-yellow-400 flex justify-center items-center`}
      >
        {/* MODAL BOX - WHITE */}
        <div
          ref={modalRef}
          className={`relative container py-2.5 bg-white max-w-[30rem] rounded-md border-3 border-gray-500 ${
            windowWidth < 420
              ? "px-3 mx-2.5"
              : 420 <= windowWidth && windowWidth < 460
              ? "mx-2.5 px-4"
              : 460 <= windowWidth
              ? "mx-7 px-4"
              : ""
          }`}
        >
          {/* MODAL HEADER */}
          <div
            className={`mt-4 border-black text-xl font-semibold flex flex-row justify-between ${
              modalMode.substring(0, 5) === "share" ? "ml-4 pl-0.5" : "ml-3"
            }`}
          >
            {/* MODAL TITLE */}
            <span>
              {modalMode === "delete post"
                ? "Delete Post"
                : modalMode === "delete protocol"
                ? "Delete Protocol"
                : modalMode === "share post"
                ? "Share Post"
                : modalMode === "share protocol"
                ? "Share Protocol"
                : modalMode === "edit post"
                ? "Edit Post"
                : modalMode === "edit protocol"
                ? "Edit Protocol"
                : modalMode === "create post"
                ? "Create New Post"
                : modalMode === "create protocol"
                ? "Create New Protocol"
                : modalMode === "create community"
                ? "Create New Community"
                : modalMode.includes("create reply")
                ? "Post New Reply"
                : ""}
            </span>

            {/* EXIT ICON FOR SHARE MODAL */}
            {modalMode.substring(0, 5) === "share" && (
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

          {/* CREATE MODAL BODY */}
          <div
            className={`border-black ${showCreateModal ? "block" : "hidden"}`}
          >
            {/* ACCESS CODE CREATION PROMPT */}
            <div>
              <hr className="mx-2.5 mb-1 h-0.5 mt-4 bg-gray-300" />
              {/* <div className="ml-4 mr-4 mt-3 text-lg-">
                    {`Are you sure you want to delete this ${
                      modalMode === "create post"
                        ? "post"
                        : modalMode === "create protocol"
                        ? "protocol"
                        : ""
                    }?`}
                  </div> */}
              {/* ______________ */}
              <div
                className={`mt-3 mx-3.5 rounded-sm flex flex-row text-center justify-between text-base-+ ${
                  formSubmitted && selectedOptionRef.current === ""
                    ? `border-rose-600 border-[1.3px]`
                    : `border-zinc-500 border`
                }`}
              >
                <div
                  onClick={() => {
                    emailInputRef.current.focus();
                    setSelectedOption("quickPost");
                  }}
                  ref={quickPostRef}
                  className={`flex items-center w-1/2 rounded-tl-sm rounded-bl-sm pt-4.5 pb-3.5 hover:bg-gray-300 font-semibold cursor-pointer text-gray-700 ${
                    selectedOption === "quickPost"
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  } ${
                    374 <= windowWidth ? "flex-row justify-center" : "flex-col"
                  }`}
                >
                  <FontAwesomeIcon
                    // icon={faBoltLightning}
                    icon={faBolt}
                    className={`text-[1.3rem] w-fit saturate-[2] cursor-pointer text-blue-300 border-black rounded-sm+ hover:text-rose-500 ${
                      374 <= windowWidth ? "mr-3.5" : "mx-auto"
                    }`}
                  />
                  <span className={`${374 <= windowWidth ? "" : "mt-2"}`}>
                    Quick {createMode === "post" ? "Post" : "Reply"}
                  </span>
                </div>
                <div
                  onClick={() => setSelectedOption("loginPost")}
                  ref={loginPostRef}
                  className={`flex items-center w-1/2 rounded-tr-sm rounded-br-sm pt-4.5 pb-3.5 border-l border-gray-400 hover:bg-gray-300 font-semibold cursor-pointer text-gray-700 ${
                    selectedOption === "loginPost"
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  } ${
                    374 <= windowWidth ? "flex-row justify-center" : "flex-col"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className={`text-[1.23rem] w-fit saturate-[1.2] cursor-pointer text-amber-600 border-black rounded-sm+ hover:text-amber-500 ${
                      374 <= windowWidth ? "mr-3.5" : "mx-auto"
                    }`}
                  />
                  <span className={`${374 <= windowWidth ? "" : "mt-2"}`}>
                    Login to {createMode === "post" ? "Post" : "Reply"}
                  </span>
                </div>
              </div>
            </div>
            {/* <hr className="mx-2 mb-1 h-[0.12rem] mt-2 bg-gray-300" /> */}
            <div className="mx-auto px-4 mt-5 mb-3 flex items-center justify-between">
              <input
                ref={emailInputRef}
                placeholder="Email"
                className={`pl-2.5 pr-1 truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.3px] ${
                  formSubmitted && !validateEmail(accessEmail)
                    ? "ring-rose-600"
                    : formSubmitted && validateEmail(accessEmail)
                    ? "ring-emerald-600"
                    : ""
                } ${copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"}`}
                value={accessEmail}
                onChange={(e) => {
                  setAccessEmail(e.target.value);
                }}
                // onKeyPress={(e) => e.preventDefault()}
              />
              <button
                className={`ml-3 px-2.5 pt-1 pb-1 relative outline-none hover:saturate-[2.5] text-white text-base+ rounded-sm+ border border-gray-500 copy-button ${
                  copiedLinkBtn ? "bg-indigo-400" : "bg-indigo-500"
                }`}
                ref={sendQuickPostRef}
                onClick={() => {
                  handleCreate();
                  // setCopiedLinkBtn(true);
                }}
                // onKeyPress={() => setCopiedLinkBtnColor("green")}
              >
                {minPhoneScreen ? (
                  <div>Post</div>
                ) : (
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className={`text-lg rotate-12 cursor-pointer text-white`}
                  />
                )}
              </button>
            </div>
            {/* <hr className="mx-2 mb-1 h-0.5 mt-4 mb-5 bg-gray-300" /> */}
          </div>

          {/* Create New Community */}
          <div
            className={`border-black ${
              showCreateCommunityModal ? "block" : "hidden"
            }`}
          >
            {/* ACCESS CODE CREATION PROMPT */}
            <div>
              <hr className="mx-2.5 mb-1 h-0.5 mt-4 bg-gray-300" />
              {/* <div className="ml-4 mr-4 mt-3 text-lg-">
                    {`Are you sure you want to delete this ${
                      modalMode === "create post"
                        ? "post"
                        : modalMode === "create protocol"
                        ? "protocol"
                        : ""
                    }?`}
                  </div> */}
              {/* ______________ */}
            </div>
            {/* <hr className="mx-2 mb-1 h-[0.12rem] mt-2 bg-gray-300" /> */}

            {/* Input */}
            <div className="mx-auto px-5 mt-5 mb-3 flex items-center justify-between">
              <input
                ref={newCommunityNameInputRef}
                placeholder="Name"
                className={`pl-2.5 pr-1 truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.3px] ${
                  formSubmitted && !validateEmail(accessEmail)
                    ? "ring-rose-600"
                    : formSubmitted && validateEmail(accessEmail)
                    ? "ring-emerald-600"
                    : ""
                } ${copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"}`}
                value={newCommunityName}
                onChange={(e) => {
                  setNewCommunityName(e.target.value);
                }}
                // onKeyPress={(e) => e.preventDefault()}
              />
            </div>
            <div className="mx-auto px-5 mt-5 mb-3 flex items-center justify-between">
              <input
                ref={newCommunityDescriptionInputRef}
                placeholder="Description"
                className={`pl-2.5 pr-1 truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.3px] ${
                  formSubmitted && newCommunityDescription === ""
                    ? "ring-rose-600"
                    : formSubmitted && newCommunityDescription
                    ? "ring-emerald-600"
                    : ""
                } ${copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"}`}
                value={newCommunityDescription}
                onChange={(e) => {
                  setNewCommunityDescription(e.target.value);
                }}
                // onKeyPress={(e) => e.preventDefault()}
              />
            </div>
            {/* <hr className="mx-2 mb-1 h-0.5 mt-4 mb-5 bg-gray-300" /> */}
            <div className="flex justify-end">
              <button
                className={`w-full mx-5 my-2 px-2.5 py-1 relative outline-none hover:saturate-[2.5] text-white text-base+ rounded-sm+ border border-gray-500 ${
                  copiedLinkBtn ? "bg-indigo-400" : "bg-indigo-500"
                }`}
                ref={createNewCommunityBtnRef}
                onClick={() => {
                  handleCreate();
                  // setCopiedLinkBtn(true);
                }}
                // onKeyPress={() => setCopiedLinkBtnColor("green")}
              >
                {minPhoneScreen ? (
                  <div>Create</div>
                ) : (
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className={`text-lg rotate-12 cursor-pointer text-white`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* SHARE MODAL BODY */}
          <div
            className={`border-black ${showShareModal ? "block" : "hidden"}`}
          >
            <hr className="mx-2 mb-1 h-0.5 mt-3 bg-gray-300" />
            <div className="mx-auto px-4 mt-5 mb-3 flex items-center justify-between">
              <input
                readOnly
                className={`pl-2.5 pr-1 truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm+ ${
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
          </div>

          {/* DELETE MODAL BODY */}
          <div
            className={`border-black ${showDeleteModal ? "block" : "hidden"}`}
          >
            <div>
              <hr className="mx-2 mb-1 h-0.5 mt-4 bg-gray-300" />
              <div className="ml-5 mr-4 mt-3 text-lg">
                {`Are you sure you want to delete this ${
                  modalMode === "delete post"
                    ? "post"
                    : modalMode === "delete protocol"
                    ? "protocol"
                    : ""
                }?`}
              </div>
            </div>
            {!session ? (
              <div>
                <div className="my-3.5 pl-6 pr-9">
                  <input
                    ref={accessCodeInputDeleteRef}
                    placeholder="Access Code"
                    className={`max-w-[] pl-2.5 pr-1 container truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.5px] ${
                      // className={`pl-2.5 pr-1 container max-w-[23rem] truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.5px] ${
                      formSubmitted && !validAccessCode
                        ? "ring-red-700"
                        : formSubmitted && validAccessCode
                        ? ""
                        : ""
                    } ${
                      copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"
                    }`}
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (!validAccessCode) {
                        setValidAccessCode(true);
                      }
                    }}
                    // onKeyPress={(e) => e.preventDefault()}
                  />
                </div>
                {/* <div className="px-7 text-black font-semibold">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className={`mr-2.5 text-lg+ cursor-pointer text-red-600`}
                      />
                      Please provide your access code in order to delete
                    </div> */}
                {/* your{" "}
                      {modalMode.includes("post")
                        ? "post"
                        : modalMode.includes("protocol")
                        ? "protocol"
                        : ""} */}
              </div>
            ) : (
              <div className="hidden"></div>
            )}
            <hr className="mx-2 mt-4 mb-3 h-0.5 bg-gray-300" />
            <div className="flex mt-3 mr-1.5 justify-end border-red-500">
              <button
                ref={deleteButtonRef}
                id="delete-btn"
                className="border text-white bg-red-700 text-lg border-gray-500 rounded px-3 py-1 outline-none hover:scale-[99.5%] hover:contrast-[120%]"
              >
                Delete
              </button>
              <button
                ref={cancelDeleteButtonRef}
                id="cancel-btn"
                className="ml-2 border text-white bg-gray-600 text-lg border-gray-700 rounded px-3 py-1 outline-none hover:scale-[99.5%] hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* EDIT MODAL BODY */}
          <div className={`border-black ${showEditModal ? "block" : "hidden"}`}>
            {!session ? (
              <div>
                <hr className="mx-2.5 my-3 h-[0.118rem] bg-gray-300" />
                <div className="ml-5 mr-4 mt-3 text-lg">
                  Enter your access code to edit
                </div>
                <div className="my-3.5 pl-6 pr-9">
                  <input
                    ref={accessCodeInputEditRef}
                    placeholder="Access Code"
                    className={`max-w-[] pl-2.5 pr-1 container truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.5px] ${
                      // className={`pl-2.5 pr-1 container max-w-[23rem] truncate bg-zinc-100 contrast-[120%] py-1 text-base text-gray-700 outline-none border border-zinc-800 rounded-sm border-none ring-[1.5px] ${
                      formSubmitted && !validAccessCode
                        ? "ring-red-700"
                        : formSubmitted && validAccessCode
                        ? ""
                        : ""
                    } ${
                      copiedLinkBtn && minPhoneScreen ? " w-full" : "w-full"
                    }`}
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (!validAccessCode) {
                        setValidAccessCode(true);
                      }
                    }}
                    // onKeyPress={(e) => e.preventDefault()}
                  />
                </div>
                {/* <div className="px-7 text-black font-semibold">
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className={`mr-2.5 text-lg+ cursor-pointer text-red-600`}
                      />
                      Please provide your access code in order to delete
                    </div> */}
                {/* your{" "}
                      {modalMode.includes("post")
                        ? "post"
                        : modalMode.includes("protocol")
                        ? "protocol"
                        : ""} */}
              </div>
            ) : (
              <div className="hidden"></div>
            )}
            <hr className="mx-2 mt-4 mb-3 h-0.5 bg-gray-300" />
            <div className="flex mt-3 mr-1.5 justify-end border-red-500">
              <button
                ref={editButtonRef}
                id="delete-btn"
                className="border text-white bg-red-700 text-lg border-gray-500 rounded px-3 py-1 outline-none hover:scale-[99.5%] hover:contrast-[120%]"
              >
                Edit
              </button>
              <button
                ref={cancelEditButtonRef}
                id="cancel-btn"
                className="ml-2 border text-white bg-gray-600 text-lg border-gray-700 rounded px-3 py-1 outline-none hover:scale-[99.5%] hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Modal;

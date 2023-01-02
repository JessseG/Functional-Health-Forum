import { Prisma } from "@prisma/client"; // check
import {
  faThumbsUp,
  faThumbsDown,
  faCaretUp,
  faHandPointUp,
  faHandPointDown,
  faAngleUp,
  faArrowUp,
  faCaretDown,
  faTrash,
  faPen,
  faComment,
  faShare,
  faReply,
  faPlusSquare,
  faAngleDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetchDedupe } from "fetch-dedupe";
import "react-quill/dist/quill.snow.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useModalContext } from "./Layout";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import Moment from "react-moment";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import { reverse } from "dns/promises";
import useSWR from "swr";
import { fetchData } from "../utils/utils";
import Modal from "./Modal";
import Image from "next/image";

// Use same as post
// export const DeletePostContext = createContext<Function | null>(null); // deletePost()

// export const useDeletePost = () => {
//   return useContext(DeletePostContext);
// };

// protocol
type FullProtocol = Prisma.ProtocolGetPayload<{
  include: {
    user: true;
    community: true;
    comments: { include: { user: true } };
    votes: true;
    products: true;
  };
}>;

// fullCom
type FullCom = Prisma.CommunityGetPayload<{
  include: {
    posts: { include: { user: true; community: true; votes: true } };
    comments: true;
    joinedUsers: true;
    protocols: {
      include: { user: true; community: true; votes: true; products: true };
    };
  };
}>;

interface Props {
  protocol: FullProtocol;
  comUrl: string;
  fullCom: FullCom;
  modal: Function;
  sideBarProtocol: boolean;
}

const Protocol = ({
  protocol,
  comUrl,
  fullCom,
  modal,
  sideBarProtocol,
}: Props) => {
  // { fullProtocol: props }: { fullProtocol: FullProtocol }
  const [showComments, setShowComments] = useState({
    toggle: false,
    quantity: 3,
  });
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [editedProtocol, setEditedProtocol] = useState({
    id: protocol.id,
    body: protocol.body,
    edit: false,
    products: protocol.products,
    access: false,
  });
  const [replyProtocol, setReplyProtocol] = useState({
    body: "",
    reply: false,
  });
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const { com } = router.query;
  const [protocolBodyHeight, setProtocolBodyHeight] = useState(0);
  const protocolBodyRef = useRef(null);
  const moreOptionsRef = useRef(null);
  const modalRef = useRef(null);
  const [disabledVote, setDisabledVote] = useState(false);
  const ellipsisRef = useRef(null);
  const [disableClick, setDisableClick] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ringColor, setRingColor] = useState("ring-blue-300");
  const [protocolEditSubmitted, setProtocolEditSubmitted] =
    useState("ring-blue-300");
  // const [protocolProducts, setProtocolProducts] = useState([]);
  const [protocolOptions, setProtocolOptions] = useState<any>({
    share: null,
    comments: null,
    reply: null,
    edit: null,
    delete: null,
  });
  const [selectMoreOptions, setSelectMoreOptions] = useState(false);
  const [hasVotedState, setHasVotedState] = useState(null);
  const [sessionlessVoteId, setSessionlessVoteId] = useState<any>(null);

  // const handleModal = useModalContext();

  // console.log(handleModal);

  const protocolUrl = `/api/protocols/findProtocol/?id=${protocol.id}`;

  // const { data: fullProtocol, error } = useSWR(protocolUrl, fetchData, {
  //   fallbackData: props,
  //   // fallbackData: props.fullCom,
  // });

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

  useEffect(() => {
    // Used this for ... show more arrow on protocol body/details
    setProtocolBodyHeight(protocolBodyRef?.current?.clientHeight);
    // console.log(protocolBodyRef?.current?.clientHeight);
  }, [windowWidth]);

  useEffect(() => {
    // Keep protocol body in sync with props protocol.body
    if (editedProtocol.body !== protocol.body) {
      setEditedProtocol((state) => ({
        ...state,
        body: protocol.body,
      }));
    }

    // Custom function to check if protocolProducts keeps in sync with props protocol.products
    let productsEqual =
      editedProtocol.products.length === protocol.products.length &&
      editedProtocol.products.every((product) => {
        return protocol.products.includes(product);
      });

    if (!productsEqual) {
      setEditedProtocol((state) => ({
        ...state,
        products: protocol.products,
      }));
    }
  }, [protocol.body, protocol.products]);

  // check if user has voted on the protocol

  const hasVoted = protocol.votes.find(
    (vote) => vote.userId === session?.userId
  );

  const voteProtocol = async (type) => {
    // if user isn't logged-in, redirect to login page
    // if (!session && !loading) {
    //   router.push("/login");
    //   return;
    // }

    // STUDY MORE
    // if user has voted, remove vote from cache
    if (session) {
      if (hasVoted) {
        // check if vote type is same as existing vote
        if (hasVoted.voteType !== type) {
          mutate(
            comUrl,
            async (state = fullCom) => {
              return {
                ...state,
                protocols: state.protocols.map((currentProtocol) => {
                  if (currentProtocol.id === protocol.id) {
                    return {
                      ...currentProtocol,
                      votes: currentProtocol.votes.map((vote) => {
                        if (vote.userId === session.userId) {
                          return {
                            ...vote,
                            voteType: type,
                          };
                        } else {
                          return vote;
                        }
                      }),
                    };
                  } else {
                    return currentProtocol;
                  }
                }),
              };
            },
            false
          );
        } else {
          mutate(
            comUrl,
            async (state) => {
              return {
                ...state,
                protocols: state.protocols.map((currentProtocol) => {
                  if (currentProtocol.id === protocol.id) {
                    return {
                      ...currentProtocol,
                      votes: currentProtocol.votes.filter(
                        (vote) => vote.userId !== session.userId
                      ),
                    };
                  } else {
                    return currentProtocol;
                  }
                }),
              };
            },
            false
          );
        }
      } else {
        mutate(
          comUrl,
          async (state = fullCom) => {
            return {
              ...state,
              protocols: state.protocols.map((currentProtocol) => {
                if (currentProtocol.id === protocol.id) {
                  return {
                    ...currentProtocol,
                    votes: [
                      ...currentProtocol.votes,
                      {
                        voteType: type,
                        userId: session.userId,
                        protocolId: currentProtocol.id,
                      },
                    ],
                  };
                } else {
                  return currentProtocol;
                }
              }),
            };
          },
          false
        );
      }

      await fetchDedupe("/api/protocols/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ protocolId: protocol.id, type }),
      });

      // revalidates the cache change from database
      mutate(comUrl);
    }
    // Sessionless Vote
    else {
      if (disabledVote) {
        return;
      }
      setDisabledVote(true);

      let changeType =
        hasVotedState === null
          ? "create"
          : hasVotedState === type
          ? "delete"
          : hasVotedState !== type
          ? "update"
          : "";

      if (hasVotedState !== null) {
        /* check if vote type is same as existing vote
           if not then change the type
        */
        if (hasVotedState !== type) {
          // change vote type - PERFECT
          mutate(
            comUrl,
            async (state = fullCom) => {
              return {
                ...state,
                protocols: state.protocols.map((currentProtocol) => {
                  if (currentProtocol.id === protocol.id) {
                    return {
                      ...currentProtocol,
                      votes: currentProtocol.votes.map((vote) => {
                        if (vote.id === sessionlessVoteId) {
                          return {
                            ...vote,
                            voteType: type,
                          };
                        } else {
                          return vote;
                        }
                      }),
                    };
                  } else {
                    return currentProtocol;
                  }
                }),
              };
            },
            false
          );
        } else {
          // remove same vote - PERFECT
          mutate(
            comUrl,
            async (state) => {
              return {
                ...state,
                protocols: state.protocols.map((currentProtocol) => {
                  if (currentProtocol.id === protocol.id) {
                    return {
                      ...currentProtocol,
                      votes: currentProtocol.votes.filter(
                        (vote, i) => vote.id !== sessionlessVoteId
                      ),
                    };
                  } else {
                    return currentProtocol;
                  }
                }),
              };
            },
            false
          );
        }
      } else {
        // add new vote - PERFECT
        mutate(
          comUrl,
          async (state = fullCom) => {
            return {
              ...state,
              protocols: state.protocols.map((currentProtocol) => {
                if (currentProtocol.id === protocol.id) {
                  return {
                    ...currentProtocol,
                    votes: [
                      ...currentProtocol.votes,
                      {
                        voteType: type,
                        protocolId: currentProtocol.id,
                      },
                    ],
                  };
                } else {
                  return currentProtocol;
                }
              }),
            };
          },
          false
        );
      }

      // ALTERNATIVE STATE HANDLING FOR SESSIONLESS
      if (hasVotedState === null) {
        // Assign Vote
        setHasVotedState(type);
      } else if (hasVotedState === type) {
        // Delete Vote
        setHasVotedState(null);
      } else if (hasVotedState !== type) {
        // Change Vote
        setHasVotedState(type);
      }

      await fetchDedupe("/api/protocols/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          protocolId: protocol.id,
          voteId: sessionlessVoteId,
          type,
          changeType,
        }),
      }).then((data) => {
        setDisabledVote(false);
        mutate(comUrl);
        setSessionlessVoteId(data.data.id);
      });

      // revalidates the cache change from database
      // mutate(comUrl);
    }
  };

  const handleReplyProtocol = async (e) => {
    e.preventDefault();

    // if (newProtocol.title) {
    //   setRingColor("transition duration-700 ease-in-out ring-red-400");
    //   return;
    // }

    if (!session) {
      router.push("/login");
      return;
    }

    if (replyProtocol.body === "") {
      return;
    }

    // create local reply
    const reply = {
      body: replyProtocol.body,
      protocol: protocol,
      communtiy: com,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session?.userId,
        },
      ],
      user: session?.user,
    };

    // FIX HERE
    // mutate (update local cache)
    mutate(
      comUrl,
      async (state) => {
        return {
          ...state,
          protocols: state.protocols.map((currentProtocol) => {
            if (
              currentProtocol.id === protocol.id &&
              protocol.id === session.userId
            ) {
              return {
                ...currentProtocol,
                comments: [...currentProtocol.comments, reply],
              };
            } else {
              return currentProtocol;
            }
          }),
          // comments: [...state.comments, reply],
        };
      },
      false
    );

    // api request
    NProgress.start();
    await fetch("/api/protocols/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply: reply }),
    });

    setReplyProtocol((state) => ({
      ...state,
      body: "",
      reply: false,
    }));
    NProgress.done();

    // validate & route back to our protocols
    mutate(comUrl);
  };

  const handleShareProtocol = async () => {
    // e.preventDefault();

    const nextAuthUrl = window.location.origin;

    const selection = await modalRef.current.handleModal(
      "share protocol",
      `${nextAuthUrl}/communities/${fullCom.name}/${protocol.id}`
    );
  };

  const handleDeleteProtocol = async () => {
    // TEMP REMOVAL - CHECK IF SESSION - IF NOT CHECK CODE in MODAL
    // if (protocol.userId !== session?.userId) {
    //   return;
    // }

    // setShowModal(true);
    // setModalMode("delete protocol");

    if (modalRef && modalRef.current) {
      const selection = await modalRef.current.handleModal(
        "delete protocol",
        null,
        protocol.id
      );

      // console.log(selection);

      if (selection === "Cancel" || selection === "" || selection === null) {
        return;
      } else if (selection === "Delete") {
        // mutate (update local cache)
        mutate(
          comUrl,
          async (state) => {
            return {
              ...state,
              protocols: state.protocols.filter(
                (currentProtocol) => currentProtocol.id !== protocol.id
              ),
            };
          },
          false
        );

        NProgress.start();
        await fetch("/api/protocols/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ protocolId: protocol.id }),
        });
        NProgress.done();

        // validate & route back to our protocols
        mutate(comUrl);

        // router.push(`/communities/${com}`);
      }
    }
  };

  const handleEditProtocol = async () => {
    // e.preventDefault();

    if (session) {
      if (!editedProtocol.edit) {
        setEditedProtocol((state) => ({
          ...state,
          edit: true,
        }));
        return;
      }

      if (
        editedProtocol.body === "" ||
        editedProtocol.products[0].name === "" ||
        editedProtocol.products[0].dose === "" ||
        editedProtocol.products[0].procedure === ""
      ) {
        return;
      }

      setDisableClick(true);

      const protocolFound = await fetch("/api/protocols/findProtocol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: protocol.id }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          return data;
        });

      const protocolProducts = await protocolFound.products;

      let productsLengthSame =
        editedProtocol.products.length === protocolProducts.length;

      let productsSame = true;

      // FIX FUNCTION FOR CHECKING PRODUCTS VS MODIFIED PRODUCTS MATCH
      for (let i = 0; i < editedProtocol.products.length; i++) {
        for (let j = 0; j < editedProtocol.products.length; j++) {
          if (editedProtocol.products[i].id !== protocolProducts[j].id) {
            if (editedProtocol.products[i].name !== protocolProducts[i].name) {
              productsSame = false;
              break;
            }
            if (editedProtocol.products[i].dose !== protocolProducts[i].dose) {
              productsSame = false;
              break;
            }
            if (
              editedProtocol.products[i].procedure !==
              protocolProducts[i].procedure
            ) {
              productsSame = false;
              break;
            }
          }
        }
        if (!productsSame) {
          break;
        }
      }

      // console.log("products Length Same: ", productsLengthSame);
      // console.log("products Same: ", productsSame);

      let bodySame = editedProtocol.body === protocol.body;

      if (bodySame && productsLengthSame && productsSame) {
        setDisableClick(false);
        setEditedProtocol((state) => ({
          ...state,
          edit: false,
        }));
        return;
      }

      // Re-structure product objects for insertion
      const strippedProducts = editedProtocol.products.map((product) => {
        let prod = {
          name: product.name,
          dose: product.dose,
          procedure: product.procedure,
        };
        return prod;
      });

      // mutate (update local cache) - for the current com (from within protocol component)
      mutate(
        comUrl,
        async (state) => {
          return {
            ...state,
            protocols: state.protocols.map((currentProtocol) => {
              if (currentProtocol.id === protocol.id) {
                return {
                  ...currentProtocol,
                  body: editedProtocol.body,
                  products: strippedProducts,
                };
              } else {
                return currentProtocol;
              }
            }),
          };
        },
        false
      );

      NProgress.start();
      await fetch("/api/protocols/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          protocol: {
            id: protocol.id,
            body: editedProtocol.body,
            products: strippedProducts,
            productsSame: productsSame,
            bodySame: bodySame,
            // products: modProducts,
          },
        }),
      }).then(() => {
        setDisableClick(false);
      });
      NProgress.done();

      // validate & route back to our protocols
      mutate(comUrl);

      setEditedProtocol((state) => ({
        ...state,
        edit: false,
      }));
    } else {
      if (editedProtocol.access && editedProtocol.edit) {
        if (
          editedProtocol.body === "" ||
          editedProtocol.products[0].name === "" ||
          editedProtocol.products[0].dose === "" ||
          editedProtocol.products[0].procedure === ""
        ) {
          return;
        }

        setDisableClick(true);

        const protocolFound = await fetch("/api/protocols/findProtocol", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: protocol.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            return data;
          });

        const protocolProducts = await protocolFound.products;

        let productsLengthSame =
          editedProtocol.products.length === protocolProducts.length;

        let productsSame = true;

        // FIX FUNCTION FOR CHECKING PRODUCTS VS MODIFIED PRODUCTS MATCH
        for (let i = 0; i < editedProtocol.products.length; i++) {
          for (let j = 0; j < editedProtocol.products.length; j++) {
            if (editedProtocol.products[i].id !== protocolProducts[j].id) {
              if (
                editedProtocol.products[i].name !== protocolProducts[i].name
              ) {
                productsSame = false;
                break;
              }
              if (
                editedProtocol.products[i].dose !== protocolProducts[i].dose
              ) {
                productsSame = false;
                break;
              }
              if (
                editedProtocol.products[i].procedure !==
                protocolProducts[i].procedure
              ) {
                productsSame = false;
                break;
              }
            }
          }
          if (!productsSame) {
            break;
          }
        }

        let bodySame = editedProtocol.body === protocol.body;

        if (bodySame && productsLengthSame && productsSame) {
          setDisableClick(false);
          setEditedProtocol((state) => ({
            ...state,
            edit: false,
          }));
          return;
        }

        // Re-structure product objects for insertion
        const strippedProducts = editedProtocol.products.map((product) => {
          let prod = {
            name: product.name,
            dose: product.dose,
            procedure: product.procedure,
          };
          return prod;
        });

        // mutate (update local cache) - for the current com (from within protocol component)
        mutate(
          comUrl,
          async (state) => {
            return {
              ...state,
              protocols: state.protocols.map((currentProtocol) => {
                if (currentProtocol.id === protocol.id) {
                  return {
                    ...currentProtocol,
                    body: editedProtocol.body,
                    products: strippedProducts,
                  };
                } else {
                  return currentProtocol;
                }
              }),
            };
          },
          false
        );

        NProgress.start();
        await fetch("/api/protocols/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            protocol: {
              id: protocol.id,
              body: editedProtocol.body,
              products: strippedProducts,
              productsSame: productsSame,
              bodySame: bodySame,
              // products: modProducts,
            },
          }),
        }).then(() => {
          setDisableClick(false);
        });
        NProgress.done();

        // validate & route back to our protocols
        mutate(comUrl);

        setEditedProtocol((state) => ({
          ...state,
          edit: false,
        }));
      } else if (editedProtocol.access && !editedProtocol.edit) {
        setEditedProtocol((state) => ({
          ...state,
          edit: true,
        }));
      } else {
        if (modalRef && modalRef.current) {
          const selection = await modalRef.current.handleModal(
            "edit protocol",
            null,
            protocol.id
          );

          if (
            selection === "Cancel" ||
            selection === "" ||
            selection === null
          ) {
            return;
          } else if (selection === "Edit") {
            if (!editedProtocol.edit || !editedProtocol.access) {
              setEditedProtocol((state) => ({
                ...state,
                access: true,
                edit: true,
              }));
              return;
            }
          }
        }
      }
    }
  };

  const calculateVoteCount = (votes) => {
    const upvotes = votes.filter((vote) => vote.voteType === "UPVOTE");
    const downvotes = votes.filter((vote) => vote.voteType === "DOWNVOTE");

    const voteCount = upvotes.length - downvotes.length;
    return voteCount;
  };

  const stripHtml = (html) => {
    var strippedHtml = html.replace(/<[^>]+>/g, "");
    return strippedHtml;
  };

  const handleRouteToProtocol = () => {
    router.push(`/protocol/${protocol.id}`);
  };

  const moreOptions = [
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faShare}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">share</span>
        </>
      ),
      value: "share",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faReply}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">reply</span>
        </>
      ),
      value: "reply",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faPen}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">edit</span>
        </>
      ),
      value: "edit",
    },
    {
      label: (
        <>
          <FontAwesomeIcon
            icon={faTrash}
            className="cursor-pointer text-[1.11rem] text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
          />
          <span className="ml-2">delete</span>
        </>
      ),
      value: "delete",
    },
  ];

  const handleClickOutside = (ref1: any, ref2: any) => {
    const clickOutside = (e: any) => {
      if (
        ref1.current &&
        !ref1.current.contains(e.target) &&
        ref2.current &&
        !ref2.current.contains(e.target)
      ) {
        setSelectMoreOptions(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", clickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", clickOutside);
    };
  };

  useEffect(() => {
    if (selectMoreOptions) {
      handleClickOutside(moreOptionsRef, ellipsisRef);
    }
  }, [selectMoreOptions]);

  const closeDownModal = () => {
    setShowModal(false);
  };

  return (
    // <DeletePostContext.Provider value={handleDeleteProtocol}>
    // </DeletePostContext.Provider>

    <div
      className="w-full mt-3 bg-color-posts hover:bg-white pt-3.5 pb-3.5 rounded border-red-400"
      // onClick={() => handleRouteToProtocol()}
    >
      {/* <button
        className="bg-red-400 p-3 font-semibold"
        onClick={() => setShowModal(!showModal)}
      >
        TOGGLE
      </button> */}
      {/* <div className="fixed m-auto top-0 right-0 bottom-0 left-0 h-[100%] w-[100%] z-10 bg-black bg-opacity-[35%]"></div> */}

      {/* {showModal && ( */}
      <Modal
        ref={modalRef}
        // showModal={showModal}
        // modalMode={modalMode}
        // shareLink={""}
        // closeDownModal={closeDownModal}
        // handleModalPromise={handleModalPromise}
      />
      {/* )} */}

      {/* PROTOCOL CONTENT CONTAINER */}
      {/* <div className="pl-9 relative flex py-0.5 border-black px-1"> */}
      <div className="relative flex py-0.5 border-black px-1">
        {/* PROTOCOL VOTES CONTAINER */}
        {460 <= windowWidth && (
          <div
            className={`flex flex-col border-black mt-0.5 w-2/32 ${
              windowWidth < 450
                ? "ml-3 mr-3"
                : 450 < windowWidth && windowWidth <= 640
                ? "ml-3 mr-3"
                : "sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-2.5"
            }`}
          >
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretUp}
              className={`${
                hasVotedState === "UPVOTE" ? "text-red-500" : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-red-500`}
              onClick={() => voteProtocol("UPVOTE")}
            />
            <div className="text-base text-center mx-1.5">
              {calculateVoteCount(protocol.votes) || 0}
            </div>
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretDown}
              className={`${
                hasVotedState === "DOWNVOTE" ? "text-blue-500" : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-blue-500`}
              onClick={() => voteProtocol("DOWNVOTE")}
            />
          </div>
        )}

        {/* ELLIPSIS MORE OPTIONS */}
        {/* <div
          className={`inline-block absolute right-7 top-3 border-black ${
            windowWidth < 475 ? `ml-9` : `ml-12`
          }`}
          onClick={(e) => {}}
        >
          <span title="Show all options" ref={ellipsisRef}>
            <FontAwesomeIcon
              size={"lg"}
              icon={faEllipsis}
              onClick={(e) => setSelectMoreOptions(!selectMoreOptions)}
              className="cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
            />
          </span>
          <div
            ref={moreOptionsRef}
            className={`${
              selectMoreOptions ? `inline-block` : `hidden`
            } mx-auto absolute right-0 top-3.5 w-[7rem]`}
          >
            <Select
              menuIsOpen={selectMoreOptions}
              // hideSelectedOptions={true}
              components={{ IndicatorSeparator: null }}
              placeholder="Hotel"
              className={`px-3 flex flex-row border-none bg-transparent outline-none `}
              // className={`px-3 flex flex-row relative bg-white rounded-sm border-0 ring-2 shadow-md outline-none `}
              // tabSelectsValue={false}
              options={moreOptions}
              value={protocolOptions.hotel}
              instanceId="select-reservation-hotel"
              // isClearable={true}
              onChange={(option) => {
                // setReservation((state: any) => ({
                //   ...state,
                //   hotel: option,
                // }));
                switch (option.value) {
                  case "share":
                    handleShareProtocol();
                    break;

                  case "reply":
                    setReplyProtocol((state) => ({
                      ...state,
                      reply: !replyProtocol.reply,
                    }));
                    if (editedProtocol.edit) {
                      setEditedProtocol((state) => ({
                        ...state,
                        edit: !editedProtocol.edit,
                      }));
                    }
                    break;

                  case "edit":
                    setEditedProtocol((state) => ({
                      ...state,
                      edit: !editedProtocol.edit,
                    }));
                    if (replyProtocol.reply) {
                      setReplyProtocol((state) => ({
                        ...state,
                        reply: !replyProtocol.reply,
                      }));
                    }
                    break;

                  case "delete":
                    handleDeleteProtocol();
                    break;
                }
                setSelectMoreOptions(!selectMoreOptions);
              }}
              styles={{
                container: (base) => ({
                  ...base,
                  // display: "",
                  // height: "100px",
                }),
                control: (base) => ({
                  ...base,
                  // height: "100px",
                  display: "none",
                  fontSize: "1.06rem",
                  background: "white",
                  borderRadius: "3px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "none",
                  width: "100%",
                }),
                valueContainer: (base) => ({
                  ...base,
                  // display: "none",
                  padding: "0",
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  margin: "0",
                }),
                singleValue: (base) => ({
                  ...base,
                  display: "none",
                  background: "transparent",
                  color: "rgb(75, 85, 99)",
                  width: "100%",
                }),
                input: (base) => ({
                  ...base,
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "rgb(156 163 175)",
                }),
                menu: (base) => ({
                  ...base,
                  width: "94.5%",
                }),
                menuList: (base) => ({
                  ...base,
                  width: "full",
                  backgroundColor: "rgb(240, 240, 240)",
                  border: "1px solid gray",
                  "::-webkit-scrollbar": {
                    width: "0px",
                    height: "0px",
                  },
                  "::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: "#888",
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }),
                option: (
                  base,
                  { data, isDisabled, isFocused, isSelected }
                ) => ({
                  ...base,
                  color: "black",
                  fontSize: "1rem",
                  padding: "0.15rem 1rem 0.15rem 1rem",
                  width: "full",
                  cursor: "pointer",
                  backgroundColor: `${
                    isFocused
                      ? "#dfe6ef"
                      : isSelected
                      ? "transparent"
                      : "transparent"
                  }`,
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  display: "none",
                  userSelect: "none",
                  backgroundColor: "transparent",
                  background: "transparent",
                  padding: "0 0 0 0",
                  margin: "0",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: 0,
                  alignSelf: "center",
                  color: "gray",
                }),
                indicatorSeparator: (base) => ({
                  ...base,
                  padding: "0",
                  marginRight: "0.4rem",
                  backgroundColor: "transparent",
                  margin: "0",
                }),
                groupHeading: (base) => ({
                  ...base,
                  color: "#FBA500",
                }),
              }}
            />
          </div>
        </div> */}

        {/* PROTOCOL CONTENT BOX --*/}
        <div
          className={`w-full  border-black ${
            460 <= windowWidth ? "mr-11" : "ml-5 mr-5"
          }`}
        >
          <span className="ml-0.5 text-sm text-gray-500">
            Posted by{" "}
            <span className="text-green-800 mr-1">
              {protocol.user?.name || "RandomUser"}{" "}
            </span>{" "}
            –
            <Moment interval={1000} className="text-gray-500 ml-2" fromNow>
              {protocol.createdAt}
            </Moment>
          </span>

          {/* Protocol Title */}
          <p className="text-xl font-semibold text-gray-850 ml-0.5 pr-3 mt-[0.55rem] mb-[0.65rem]">
            {protocol.title}
          </p>

          {/* PROTOCOL PRODUCTS COMPONENT LIST */}
          {!editedProtocol.edit && (
            <div className="rounded pb-0 border-red-400">
              <ul className="ml-5 mr-2 font-semibold border-black">
                {protocol.products.map((product, key) => {
                  return (
                    <li
                      key={key}
                      className="cursor-text"
                      style={{ listStyleType: "square" }}
                    >
                      <span className="text-indigo-700 font-semibold">
                        {product.name}
                      </span>{" "}
                      - {product.dose} -{" "}
                      <div className="font-normal inline-block text-ellipsis ml-0.5">
                        {" "}
                        {product.procedure}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Protocol Body Content */}
          {!editedProtocol.edit && (
            <div className="border-black">
              <div
                ref={protocolBodyRef}
                className={`cursor-text text-gray-900 ml-0 pr-0 leading-6 border-red-500 ${
                  !showFullProtocol ? "max-h-[9rem] overflow-hidden" : ""
                }`}
              >
                {stripHtml(protocol.body)}
              </div>
              {/* SHOW HIDE/SHOW ARROWS */}
              {!editedProtocol.edit && protocolBodyHeight > 135 && (
                <div className="text-right -mb-4 border-black mr-0.5">
                  {!showFullProtocol && (
                    <div
                      className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                      onClick={() => {
                        setShowFullProtocol(true);
                      }}
                    >
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faAngleDown}
                        className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                      />
                    </div>
                  )}
                  {showFullProtocol && (
                    <div
                      className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                      onClick={() => {
                        setShowFullProtocol(false);
                      }}
                    >
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faAngleUp}
                        className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* EDIT PROTOCOL PRODUCTS COMPONENT */}
          {editedProtocol.edit && (
            <div
              className={`mt-1 ml-1 mb-2.5 -mr-3.5 ${
                765 <= windowWidth ? "mr-1.5" : ""
              }`}
            >
              <div className="flex items-center mb-2 border-black">
                <div className="ml-1 font-semibold border-black text-base+">{`Products ${" "}`}</div>
                {/* ADDS NEW PRODUCT TO PROTOCOL */}
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  className={`cursor-pointer ml-3 faPlus border-none text-emerald-400 hover:text-cyan-500`}
                  type="button"
                  onClick={() => {
                    // Allows for adding a new protocol
                    if (
                      editedProtocol.products.length === 0 ||
                      (editedProtocol.products.length < 6 &&
                        editedProtocol.products[
                          editedProtocol.products.length - 1
                        ]?.name)
                    ) {
                      const protoProducts: any = [
                        ...editedProtocol.products,
                        {
                          name: "",
                          dose: "",
                          procedure: "",
                        },
                      ];
                      setEditedProtocol((state) => ({
                        ...state,
                        products: protoProducts,
                      }));
                    }
                  }}
                />
              </div>

              {550 <= windowWidth && (
                <div>
                  {editedProtocol.products.map((product, key) => {
                    return (
                      <div
                        className="w-full mb-3.5 inline-flex items-center"
                        key={key}
                      >
                        <div
                          className={`w-full rounded-sm items-center justify-between inline-flex border-red-600 ring-1 ${
                            (product.name === "" ||
                              product.dose === "" ||
                              product.procedure === "") &&
                            protocolEditSubmitted
                              ? `${ringColor}`
                              : ``
                          }`}
                        >
                          <input
                            type="text"
                            className={`px-2.5 py-1.5 truncate rounded-l-sm text-sm++ placeholder-gray-400 text-zinc-800 relative ring-blue-300 ring-2 ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white border-0 shadow-md outline-none focus:outline-none w-1/3`}
                            placeholder="Name"
                            value={product.name}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].name = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                          <input
                            type="text"
                            className={`px-2.5 py-1.5 truncate text-sm++ placeholder-gray-400 text-blue-600 relative ring-blue-300 ring-2 ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white border-0 shadow-md outline-none focus:outline-none w-5/24`}
                            placeholder="Dose"
                            value={product.dose}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].dose = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                          <input
                            type="text"
                            className={`px-2.5 py-1.5 truncate rounded-r-sm text-sm++ placeholder-gray-400 relative ring-blue-300 ring-2 ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white border-0 shadow-md outline-none focus:outline-none w-11/24`}
                            placeholder="Procedure"
                            value={product.procedure}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].procedure = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                        </div>
                        {/* DELETE PROTOCOL PRODUCT */}
                        <FontAwesomeIcon
                          size={"lg"}
                          icon={faTrash}
                          onClick={() => {
                            if (editedProtocol.products.length > 1) {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts.splice(key, 1);
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }
                            if (
                              key === 0 &&
                              editedProtocol.products.length === 1
                            ) {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[0].name = "";
                              protoProducts[0].dose = "";
                              protoProducts[0].procedure = "";
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }
                          }}
                          className="ml-3.5 mr-1.5 cursor-pointer text-gray-600 hover:text-red-500 invert-25 hover:invert-0"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {windowWidth < 550 && (
                <div>
                  {editedProtocol.products.map((product, key) => {
                    return (
                      <div
                        className="w-full mb-3.5 inline-flex items-center"
                        key={key}
                      >
                        <div
                          className={`w-full rounded-sm items-center border-red-600 ring-2 ${
                            (product.name === "" ||
                              product.dose === "" ||
                              product.procedure === "") &&
                            protocolEditSubmitted
                              ? `${ringColor}`
                              : ``
                          }`}
                        >
                          <input
                            type="text"
                            className={`px-2.5 py-1.5 truncate font-semibold rounded-tl-sm rounded-tr-sm text-sm++ border-b-[0.1rem] border-zinc-200 placeholder-gray-400 text-zinc-700 block w-full ring-blue-300 ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white border-0 outline-none focus:outline-none`}
                            placeholder="Name"
                            value={product.name}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].name = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                          <input
                            type="text"
                            className={`px-2.5 py-1.5 truncate text-sm++ border-b-[0.1rem] border-zinc-200 placeholder-gray-400 text-blue-600 block w-full ring-blue-300 ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white border-0 outline-none focus:outline-none`}
                            placeholder="Dose"
                            value={product.dose}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].dose = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                          {/* <input
                              type="text"
                              className={`px-2.5 py-1.5 truncate rounded-r-sm text-sm++ placeholder-gray-400 text-emerald-600 block w-full ring-blue-300 ${
                                (product.name === "" ||
                                  product.dose === "" ||
                                  product.procedure === "") &&
                                protocolEditSubmitted
                                  ? `${ringColor}`
                                  : ``
                              } bg-white border-0 outline-none focus:outline-none`}
                              placeholder="Procedure"
                              value={product.procedure}
                              onChange={(e) => {
                                const protoProducts = [
                                  ...editedProtocol.products,
                                ];
                                protoProducts[key].procedure = e.target.value;
                                setEditedProtocol((state) => ({
                                  ...state,
                                  products: protoProducts,
                                }));
                              }}
                            /> */}

                          <TextareaAutosize
                            // autoFocus={focusWhere("content")}
                            // onFocus={(e) => {
                            //   var val = e.target.value;
                            //   e.target.value = "";
                            //   e.target.value = val;
                            //   setFocus("content");
                            // }}
                            minRows={1}
                            className={`form-textarea min-h-[2.3rem] text-violet-700 block w-full px-2.5 py-1.5 text-sm++ outline-none overflow-hidden ${
                              (product.name === "" ||
                                product.dose === "" ||
                                product.procedure === "") &&
                              protocolEditSubmitted
                                ? `${ringColor}`
                                : ``
                            } bg-white`}
                            placeholder="Procedure"
                            value={product.procedure}
                            onChange={(e) => {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[key].procedure = e.target.value;
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }}
                          />
                        </div>

                        {/* DELETE PROTOCOL PRODUCT */}
                        <FontAwesomeIcon
                          size={"lg"}
                          icon={faTrash}
                          onClick={() => {
                            if (editedProtocol.products.length > 1) {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts.splice(key, 1);
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }
                            if (
                              key === 0 &&
                              editedProtocol.products.length === 1
                            ) {
                              const protoProducts = [
                                ...editedProtocol.products,
                              ];
                              protoProducts[0].name = "";
                              protoProducts[0].dose = "";
                              protoProducts[0].procedure = "";
                              setEditedProtocol((state) => ({
                                ...state,
                                products: protoProducts,
                              }));
                            }
                          }}
                          className="ml-3.5 mr-1.5 cursor-pointer text-gray-600 hover:text-red-500 invert-25 hover:invert-0"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PROTOCOL EDITING BOX */}
          {/* {editedProtocol.edit && protocol.userId === session?.userId && ( */}
          {editedProtocol.edit && (
            <div className="mt-1 rounded-sm border-blue-300 container p-1 border-0 shadow-lg ring-gray-300 ring-2">
              <TextareaAutosize
                autoFocus={true}
                onFocus={(e) => {
                  var val = e.target.value;
                  e.target.value = "";
                  e.target.value = val;
                }}
                minRows={2}
                className="text-gray-600 block container px-3 py-1 outline-none no-scroll"
                placeholder="Content"
                value={stripHtml(editedProtocol.body)}
                onChange={(e) =>
                  setEditedProtocol((state) => ({
                    ...state,
                    body: e.target.value,
                  }))
                }
              />
            </div>
          )}

          {/* PROTOCOLS OPTIONS BOX */}
          <div className="mt-3 mr-2 flex flex-nowrap justify-between border-black">
            <div className="mt-1 flex-row flex-nowrap pl-1 border-red-500 inline-flex text-sm++">
              {/* PROTOCOL VOTES BOX */}
              {windowWidth < 460 && (
                <div
                  className={`flex flex-row rounded-lg ring-gray-500 pt-0 border-black justify-between mr-4 ${
                    windowWidth < 500
                      ? `ml-[0.18rem]`
                      : windowWidth < 765
                      ? `ml-1.5`
                      : `ml-1.5`
                  }`}
                >
                  {/* <FontAwesomeIcon
                      icon={faCircleCheck}
                      className={`${
                        calculateVoteCount(post.votes) > 0
                          ? "text-emerald-600"
                          : "text-gray-400"
                        //   hasVoted?.voteType === "UPVOTE"
                        //   ? "text-red-500"
                        //   : "text-emerald-600"
                        // // : "text-purple-500"
                      } cursor-pointer text-black hover:text-emerald-600 hover:saturate-5 text-[1.4rem]`}
                      onClick={() => votePost("UPVOTE")}
                    /> */}
                  <div className="cursor-pointer relative w-[2.2rem] h-[1.3rem] bg-transparent">
                    <Image
                      layout="fill"
                      onClick={() => voteProtocol("UPVOTE")}
                      className={`
                        ${
                          hasVotedState === "UPVOTE"
                            ? "-hue-rotate-30"
                            : "grayscale-[100%] -hue-rotate-30 hover:grayscale-0"
                        }`}
                      src="/images/arrowUp.png"
                      alt="Upvote"
                    />
                  </div>
                  <div className="text-base text-center w-full -mx-[0.25rem] border-red-500">
                    {/* 29 */}
                    {calculateVoteCount(protocol.votes) || 0}
                  </div>
                  <div className="cursor-pointer relative mt-[0.04rem] w-[2.2rem] h-[1.3rem] bg-transparent">
                    <Image
                      layout="fill"
                      onClick={() => voteProtocol("DOWNVOTE")}
                      className={`rotate-180 ${
                        hasVotedState === "DOWNVOTE"
                          ? "-hue-rotate-[165deg]"
                          : "grayscale-[100%] hover:-hue-rotate-[165deg] hover:grayscale-0"
                      }`}
                      src="/images/arrowUp.png"
                      alt="Downvote"
                    />
                  </div>
                  {/* <FontAwesomeIcon
                      icon={faCircleXmark}
                      className={`${
                        calculateVoteCount(post.votes) < 0
                          ? "text-blue-500"
                          : "text-gray-400"
                        //  hasVoted?.voteType === "DOWNVOTE"
                        //  ? "text-blue-500"
                        //  : "text-gray-400"
                      } cursor-pointer text-black hover:text-blue-500 text-[1.37rem]`}
                      onClick={() => votePost("DOWNVOTE")}
                    /> */}
                </div>
              )}

              {/* Options Container */}
              <div className="flex flex-row post-options-box flex-wrap pl-0.5 border-black text-sm++">
                {/* SHARE PROTOCOL */}
                <div
                  className={`cursor-pointer inline-block ${
                    windowWidth < 460 ? "ml-1" : ""
                  }`}
                  onClick={() => handleShareProtocol()}
                >
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faShare}
                    className="text-gray-600 hover:text-red-500 align middle mt-0.25 invert-25 hover:invert-0"
                  />
                  <span className="post-options ml-1.5 font-semibold text-purple-500">
                    share
                  </span>
                </div>

                {/* PROTOCOL COMMENTS BOX */}
                <div
                  className={`inline-block border-black cursor-pointer ${
                    windowWidth < 765 ? `ml-4` : `ml-6`
                  }`}
                  onClick={() => {
                    if (protocol.comments?.length !== 0) {
                      setShowComments((state) => ({
                        ...state,
                        toggle: !showComments.toggle,
                      }));
                      // console.log(showComments.toggle);
                    }
                  }}
                >
                  {/* PROTOCOL COMMENTS ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faComment}
                    className={`text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0`}
                  />

                  {/* PROTOCOL COMMENTS TEXT */}
                  <span className="post-options ml-1.5 font-semibold text-purple-500">
                    {`${protocol.comments?.length || 0} ${
                      protocol.comments?.length === 1 ? "reply" : "replies"
                    }`}
                  </span>
                </div>

                {/* REPLY PROTOCOL BOX */}
                <div
                  className={`inline-block border-black cursor-pointer ${
                    windowWidth < 765 ? `ml-3` : `ml-5`
                  }`}
                  onClick={() => {
                    setReplyProtocol((state) => ({
                      ...state,
                      reply: !replyProtocol.reply,
                    }));
                    if (editedProtocol.edit) {
                      setEditedProtocol((state) => ({
                        ...state,
                        edit: !editedProtocol.edit,
                      }));
                    }
                  }}
                >
                  {/* REPLY PROTOCOL ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faReply}
                    className="text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                  />

                  {/* REPLY PROTOCOL TEXT */}
                  <span className="post-options ml-1 font-semibold text-purple-500">
                    reply
                  </span>
                </div>

                {/* EDIT PROTOCOL BOX */}
                {/* {protocol.userId === session?.userId && !sideBarProtocol && ( */}
                {!sideBarProtocol && (
                  <div
                    className={`inline-block cursor-pointer border-black ${
                      windowWidth < 765 ? `ml-3.5` : `ml-6`
                    }`}
                    onClick={() => {
                      handleEditProtocol();
                      if (replyProtocol.reply) {
                        setReplyProtocol((state) => ({
                          ...state,
                          reply: !replyProtocol.reply,
                        }));
                      }
                    }}
                  >
                    {/* EDIT PROTOCOL ICON */}
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faPen}
                      className="text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    />

                    {/* EDIT PROTOCOL TEXT */}
                    <span className="post-options ml-1 font-semibold text-purple-500">
                      edit
                    </span>
                  </div>
                )}

                {/* DELETE PROTOCOL BOX */}
                {/* {protocol.userId === session?.userId && */}
                <div
                  className={`inline-block cursor-pointer border-black ${
                    windowWidth < 765 ? `ml-3.5` : `ml-6`
                  }`}
                  onClick={() => handleDeleteProtocol()}
                >
                  {/* DELETE PROTOCOL ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  />

                  {/* DELETE PROTOCOL TEXT */}
                  <span className="post-options ml-2 inline-block font-semibold text-purple-500">
                    delete
                  </span>
                </div>
              </div>

              {/* ELLIPSIS MORE OPTIONS */}
              <div
                className={`relative inline-flex items-center mt-0.5 border-black ${
                  windowWidth < 460 && !editedProtocol.edit
                    ? `pl-0.5 ml-4 mr-4`
                    : windowWidth < 460 && editedProtocol.edit
                    ? `pl-0.5 ml-4 mr-2`
                    : `ml-7 mr-14`
                }`}
              >
                <span title="Show all options" ref={ellipsisRef}>
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faEllipsis}
                    onClick={(e) => setSelectMoreOptions(!selectMoreOptions)}
                    className="cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  />
                </span>
                <div
                  ref={moreOptionsRef}
                  className={`${
                    selectMoreOptions ? `inline-block` : `hidden`
                  } mx-auto absolute w-[7rem] ${
                    windowWidth < 460 ? "right-0 top-6" : "-left-4 top-5"
                  }`}
                >
                  <Select
                    menuIsOpen={selectMoreOptions}
                    // hideSelectedOptions={true}
                    components={{ IndicatorSeparator: null }}
                    placeholder="Hotel"
                    className={`px-3 flex flex-row border-none bg-transparent outline-none `}
                    // className={`px-3 flex flex-row relative bg-white rounded-sm border-0 ring-2 shadow-md outline-none `}
                    // tabSelectsValue={false}
                    options={moreOptions}
                    value={protocolOptions.hotel}
                    instanceId="select-reservation-hotel"
                    // isClearable={true}
                    onChange={(option) => {
                      // setReservation((state: any) => ({
                      //   ...state,
                      //   hotel: option,
                      // }));
                      switch (option.value) {
                        case "share":
                          handleShareProtocol();
                          break;

                        case "reply":
                          setReplyProtocol((state) => ({
                            ...state,
                            reply: !replyProtocol.reply,
                          }));
                          if (editedProtocol.edit) {
                            setEditedProtocol((state) => ({
                              ...state,
                              edit: !editedProtocol.edit,
                            }));
                          }
                          break;

                        case "edit":
                          handleEditProtocol();
                          if (replyProtocol.reply) {
                            setReplyProtocol((state) => ({
                              ...state,
                              reply: !replyProtocol.reply,
                            }));
                          }
                          break;

                        case "delete":
                          handleDeleteProtocol();
                          break;
                      }
                      setSelectMoreOptions(!selectMoreOptions);
                    }}
                    styles={{
                      container: (base) => ({
                        ...base,
                        // display: "",
                        // height: "100px",
                      }),
                      control: (base) => ({
                        ...base,
                        // height: "100px",
                        display: "none",
                        fontSize: "1.06rem",
                        background: "white",
                        borderRadius: "3px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "none",
                        width: "100%",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        // display: "none",
                        padding: "0",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                        margin: "0",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        display: "none",
                        background: "transparent",
                        color: "rgb(75, 85, 99)",
                        width: "100%",
                      }),
                      input: (base) => ({
                        ...base,
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "rgb(156 163 175)",
                      }),
                      menu: (base) => ({
                        ...base,
                        width: "94.5%",
                      }),
                      menuList: (base) => ({
                        ...base,
                        width: "full",
                        backgroundColor: "rgb(240, 240, 240)",
                        border: "1px solid gray",
                        "::-webkit-scrollbar": {
                          width: "0px",
                          height: "0px",
                        },
                        "::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "::-webkit-scrollbar-thumb": {
                          background: "#888",
                        },
                        "::-webkit-scrollbar-thumb:hover": {
                          background: "#555",
                        },
                      }),
                      option: (
                        base,
                        { data, isDisabled, isFocused, isSelected }
                      ) => ({
                        ...base,
                        color: "black",
                        fontSize: "1rem",
                        padding: "0.15rem 1rem 0.15rem 1rem",
                        width: "full",
                        cursor: "pointer",
                        backgroundColor: `${
                          isFocused
                            ? "#dfe6ef"
                            : isSelected
                            ? "transparent"
                            : "transparent"
                        }`,
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        display: "none",
                        userSelect: "none",
                        backgroundColor: "transparent",
                        background: "transparent",
                        padding: "0 0 0 0",
                        margin: "0",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 0,
                        alignSelf: "center",
                        color: "gray",
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        padding: "0",
                        marginRight: "0.4rem",
                        backgroundColor: "transparent",
                        margin: "0",
                      }),
                      groupHeading: (base) => ({
                        ...base,
                        color: "#FBA500",
                      }),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SAVE PROTOCOL EDIT BUTTON */}
            {/* {protocol.userId === session?.userId && editedProtocol.edit && ( */}
            {editedProtocol.edit && (
              <span
                className={`mt-0.5 ${
                  !editedProtocol.edit && windowWidth <= 550
                    ? "ml-4 -mr-1.5"
                    : editedProtocol.edit && windowWidth <= 550
                    ? "ml-5 -mr-1"
                    : 765 <= windowWidth
                    ? "ml-4 -mr-1.5"
                    : "ml-4 -mr-1"
                } border-black`}
              >
                <button
                  disabled={disableClick}
                  onClick={() => handleEditProtocol()}
                  className="select-none text-gray-800 font-semibold cursor-pointer bg-purple-300 contrast-125 hover:contrast-[113%] rounded-[0.15rem] px-2.5 py-[0.18rem] ring-1 ring-gray-500 border-zinc-400"
                >
                  Save
                </button>
              </span>
            )}

            {/* SHOW HIDE/SHOW ARROWS
            {!editedProtocol.edit && protocolBodyHeight > 134.5 && (
              <div className="border-black -mt-2.5 mr-2">
                {!showFullProtocol && (
                  <div
                    className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => {
                      setShowFullProtocol(true);
                    }}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faAngleDown}
                      className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                    />
                  </div>
                )}
                {showFullProtocol && (
                  <div
                    className="text-xs text-purple-700 cursor-pointer hover:text-purple-500"
                    onClick={() => {
                      setShowFullProtocol(false);
                    }}
                  >
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faAngleUp}
                      className="ml-3.5 mr-1.5 cursor-pointer text-purple-500 hover:text-red-500 invert-25 hover:invert-0"
                    />
                  </div>
                )}
              </div>
            )} */}
          </div>

          {/* REPLY/COMMENT ON PROTOCOL BOX */}
          {/* {replyProtocol.reply && protocol.userId === session?.userId && ( */}
          {replyProtocol.reply && (
            <div className="">
              <div className="mx-auto my-4 px-3 py-2 border border-gray-400 rounded">
                {/* <div className="mt-1 rounded-sm border-blue-300 container p-1 border-0 shadow-lg ring-gray-300 ring-2"> */}
                <TextareaAutosize
                  autoFocus={true}
                  onFocus={(e) => {
                    var val = e.target.value;
                    e.target.value = "";
                    e.target.value = val;
                  }}
                  minRows={2}
                  className="text-gray-600 block container px-1.5 py-1 outline-none no-scroll"
                  placeholder="Reply"
                  value={replyProtocol.body}
                  onChange={(e) =>
                    setReplyProtocol((state) => ({
                      ...state,
                      body: e.target.value,
                    }))
                  }
                />
              </div>
              <div
                className="ml-auto border-black flex flex-col"
                onClick={(e) => handleReplyProtocol(e)}
              >
                {/* <FontAwesomeIcon
                    size={"lg"}
                    icon={faTrash}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                  /> */}
                <div className="text-gray-800 text-center font-semibold cursor-pointer bg-purple-300 rounded px-2.5 py-1.5 border ring-1 ring-gray-400 border-zinc-400">
                  Reply
                </div>
              </div>
            </div>
          )}

          {/* COMMENTS MAPPED */}
          <div
            className="border-black"
            style={
              showComments.toggle ? { display: "block" } : { display: "none" }
            }
          >
            {protocol.comments
              ?.slice(0)
              .reverse()
              .map((comment, id) => {
                if (showAllComments) {
                } else if (id >= showComments.quantity) {
                  return null;
                }
                return (
                  <div
                    key={comment.id}
                    className="mx-auto mt-5 mb-3 px-3 py-2 border-l border-t rounded-tl border-gray-400"
                  >
                    <div className="mb-1 text-sm text-gray-500">
                      <span className="text-green-800">
                        {comment.user.name}
                      </span>{" "}
                      –
                      <span>
                        <Moment className="text-gray-500 ml-2" fromNow>
                          {comment.createdAt}
                        </Moment>
                      </span>
                    </div>
                    <div>{comment.body}</div>
                  </div>
                );
              })}
            <div className="text-right pr-3 py-0 -mb-1">
              {showAllComments && (
                <span
                  className="underline-offset-4 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                  onClick={() => {
                    setShowComments((state) => ({ ...state, toggle: false })),
                      setShowAllComments(false);
                  }}
                >
                  hide all replies....
                </span>
              )}
              {!showAllComments && (
                <span
                  className="underline-offset-4 text-sm text-purple-700 cursor-pointer hover:text-purple-500"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  show all replies....
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protocol;

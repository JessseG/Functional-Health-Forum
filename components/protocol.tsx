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
import { createContext, useContext, useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import TextareaAutosize from "react-textarea-autosize";
import { reverse } from "dns/promises";

// Use same as post
export const DeletePostContext = createContext<Function | null>(null); // deletePost()

export const useDeletePost = () => {
  return useContext(DeletePostContext);
};

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

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
    protocols: { include: { user: true; community: true; votes: true } };
  };
}>;

interface Props {
  protocol: FullProtocol;
  comUrl: string;
  fullCom: FullCom;
  modal: Function;
  editable: boolean;
}

const Protocol = ({ protocol, comUrl, fullCom, modal, editable }: Props) => {
  const [showComments, setShowComments] = useState({
    toggle: false,
    quantity: 3,
  });
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editedProtocol, setEditedProtocol] = useState({
    id: protocol.id,
    body: protocol.body,
    edit: false,
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
  const [disableClick, setDisableClick] = useState(false);
  const [ringColor, setRingColor] = useState("ring-blue-300");
  const [protocolEditSubmitted, setProtocolEditSubmitted] =
    useState("ring-blue-300");
  const [protocolProducts, setProtocolProducts] = useState(protocol.products);

  const handleModal = useModalContext();

  useEffect(() => {
    // Used this for ... show more arrow on protocol body/details
    setProtocolBodyHeight(protocolBodyRef?.current?.clientHeight);
    // console.log(protocolBodyRef?.current?.clientHeight);

    // Keep protocol body in sync with props protocol.body
    if (editedProtocol.body !== protocol.body) {
      setEditedProtocol((state) => ({
        ...state,
        body: protocol.body,
      }));
    }

    // Custom function to check if protocolProducts keeps in sync with props protocol.products
    let productsEqual =
      protocolProducts.length === protocol.products.length &&
      protocolProducts.every((product) => {
        return protocol.products.includes(product);
      });

    if (!productsEqual) {
      setProtocolProducts(protocol.products);
    }
  }, [protocol.body, protocol.products]);

  // check if user has voted on the protocol
  const hasVoted = protocol.votes.find(
    (vote) => vote.userId === session?.userId
  );

  // console.log(fullCom);
  const voteProtocol = async (type) => {
    // if user isn't logged-in, redirect to login page
    if (!session && !loading) {
      router.push("/login");
      return;
    }

    // STUDY MORE
    // if user has voted, remove vote from cache
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

  const handleDeleteProtocol = async (e) => {
    e.preventDefault();

    if (protocol.userId !== session?.userId) {
      return;
    }

    const selection = await handleModal();

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
  };

  const handleEditProtocol = async (e) => {
    e.preventDefault();

    if (
      protocol.userId !== session?.userId ||
      editedProtocol.body === "" ||
      protocolProducts[0].name === "" ||
      protocolProducts[0].dose === "" ||
      protocolProducts[0].procedure === ""
    ) {
      return;
    }

    setDisableClick(true);

    let productsSame =
      protocolProducts.length === protocol.products.length &&
      protocolProducts.every((product) => {
        return protocol.products.includes(product);
      });

    let bodySame = editedProtocol.body === protocol.body;

    if (bodySame && productsSame) {
      setDisableClick(false);
      setEditedProtocol((state) => ({
        ...state,
        edit: false,
      }));
      return;
    }

    // Re-structure product objects for insertion
    const strippedProducts = protocolProducts.map((product) => {
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

    // const addedProducts: any = [];
    // const oneToDelete = [];
    // const modProducts = protocolProducts.map((product, index) => {
    //   let prod;
    //   let newProd;
    //   if (product.id) {
    //     prod = { create: null, update: null, where: null };
    //     prod.create = {
    //       name: product.name,
    //       dose: product.dose,
    //       procedure: product.procedure,
    //     };
    //     prod.update = {
    //       name: product.name,
    //       dose: product.dose,
    //       procedure: product.procedure,
    //     };
    //     prod.where = { id: product.id };
    //     return prod;
    //   } else {
    //     newProd = { create: null, update: null, where: null };
    //     newProd.create = {
    //       name: product.name,
    //       dose: product.dose,
    //       procedure: product.procedure,
    //     };
    //     newProd.update = {
    //       name: product.name,
    //       dose: product.dose,
    //       procedure: product.procedure,
    //     };
    //     newProd.where = { id: undefined };

    //     addedProducts.push(newProd);
    //     oneToDelete.push(index);
    //   }
    // });

    // oneToDelete
    //   .slice(0)
    //   .reverse()
    //   .map((i) => {
    //     console.log(modProducts[i]);
    //     modProducts.splice(i, 1);
    //   });

    // console.log("modProducts - ", modProducts);
    // console.log("addProducts - ", addedProducts);

    // addedProducts.map((newProd) => {
    //   modProducts.push(newProd);
    // });

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

    // setProtocolProducts([]);

    // router.push(`/communities/${com}`);
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

  return (
    <DeletePostContext.Provider value={handleDeleteProtocol}>
      <div
        className="w-full mt-3 bg-color-posts hover:bg-white cursor-pointer pt-3.5 pb-3.5 rounded border-red-400"
        // onClick={() => handleRouteToProtocol()}
      >
        {/* PROTOCOL VOTES & CONTENT CONTAINER */}
        <div className="flex border-black px-1">
          {/* PROTOCOL VOTES */}
          <div className="flex flex-col min-w-2/32 max-w-2/32 mx-4 sm:mx-3.5 md:mx-3 lg:mx-3.5 xl:mx-3 2xl:mx-2.5 items-center">
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretUp}
              onClick={() => voteProtocol("UPVOTE")}
              className={`${
                hasVoted?.voteType === "UPVOTE"
                  ? "text-red-500"
                  : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-red-500`}
            />
            <p className="text-base text-center mx-1.5">
              {calculateVoteCount(protocol.votes) || 0}
            </p>
            <FontAwesomeIcon
              size={"2x"}
              icon={faCaretDown}
              onClick={() => voteProtocol("DOWNVOTE")}
              className={`${
                hasVoted?.voteType === "DOWNVOTE"
                  ? "text-blue-500"
                  : "text-gray-600"
              } cursor-pointer text-gray-600 hover:text-blue-500`}
            />
          </div>
          {/* PROTOCOL CONTENT BOX */}
          <div
            className={`w-full ${
              editable ? "mr-12" : "mr-8"
            } pr-1 border-blue-500`}
          >
            <span className="text-sm text-gray-500">
              Posted by{" "}
              <span className="text-green-800 mr-1">
                {protocol.user?.name}{" "}
              </span>{" "}
              –
              <Moment interval={1000} className="text-gray-500 ml-2" fromNow>
                {protocol.createdAt}
              </Moment>
            </span>
            {/* Protocol Title */}
            <p className="text-xl font-semibold text-gray-850 ml-1 mt-[0.55rem] mb-[0.65rem]">
              {protocol.title}
            </p>

            {/* PROTOCOL CHECKLIST */}
            {!editedProtocol.edit && (
              <div className="rounded pb-3 border-red-400">
                <ul className="ml-5 font-semibold border-black">
                  {protocol.products.map((product, key) => {
                    return (
                      <li
                        key={key}
                        className=""
                        style={{ listStyleType: "square" }}
                      >
                        {product.name} -
                        <span className="font-normal">
                          {" "}
                          ({product.dose}) - {product.procedure}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* EDIT PROTOCOL PRODUCTS COMPONENT */}
            {editedProtocol.edit && (
              <div className="ml-1 mb-2.5">
                <div className="flex items-center mb-2 border-black">
                  <div className="ml-1 font-semibold border-black text-base+">{`Products ${" "}`}</div>
                  {/* ADDS NEW PRODUCT TO PROTOCOL */}
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    className={`cursor-pointer ml-3 faPlus border-none text-emerald-400 hover:text-amber-800`}
                    type="button"
                    onClick={() => {
                      // Allows for adding a new protocol
                      if (
                        protocolProducts.length === 0 ||
                        (protocolProducts.length < 6 &&
                          protocolProducts[protocolProducts.length - 1]?.name)
                      ) {
                        const protoProducts: any = [
                          ...protocolProducts,
                          {
                            name: "",
                            dose: "",
                            procedure: "",
                          },
                        ];
                        setProtocolProducts(protoProducts);
                      }
                    }}
                  />
                </div>
                {protocolProducts.map((product, key) => {
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
                          className={`px-2.5 py-1.5 rounded-l-sm text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
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
                            const protoProducts = [...protocolProducts];
                            protoProducts[key].name = e.target.value;
                            setProtocolProducts(protoProducts);
                          }}
                        />
                        <input
                          type="text"
                          className={`px-2.5 py-1.5 text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
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
                            const protoProducts = [...protocolProducts];
                            protoProducts[key].dose = e.target.value;
                            setProtocolProducts(protoProducts);
                          }}
                        />
                        <input
                          type="text"
                          className={`px-2.5 py-1.5 rounded-r-sm text-sm++ placeholder-gray-400 text-black relative ring-blue-300 ring-2 ${
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
                            const protoProducts = [...protocolProducts];
                            protoProducts[key].procedure = e.target.value;
                            setProtocolProducts(protoProducts);
                          }}
                        />
                      </div>
                      {/* DELETE PROTOCOL PRODUCT */}
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faTrash}
                        onClick={() => {
                          if (protocolProducts.length > 1) {
                            const protoProducts = [...protocolProducts];
                            protoProducts.splice(key, 1);
                            setProtocolProducts(protoProducts);
                          }
                          if (key === 0 && protocolProducts.length === 1) {
                            const protoProducts = [...protocolProducts];
                            protoProducts[0].name = "";
                            protoProducts[0].dose = "";
                            protoProducts[0].procedure = "";
                            setProtocolProducts(protoProducts);
                          }
                        }}
                        className="ml-3.5 mr-1.5 cursor-pointer text-gray-600 hover:text-red-500 invert-25 hover:invert-0"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {/* Protocol Body Content */}
            {!editedProtocol.edit && (
              <div>
                <p
                  ref={protocolBodyRef}
                  className={`text-gray-900 ml-0 pr-0 border-black ${
                    !showFullProtocol && editable
                      ? "leading-6 max-h-[9rem] overflow-hidden"
                      : !showFullProtocol && !editable
                      ? "leading-6 max-h-[18rem] overflow-hidden"
                      : ""
                  }`}
                >
                  {stripHtml(protocol.body)}
                </p>
              </div>
            )}

            {/* PROTOCOL EDITING BOX */}
            {editedProtocol.edit && protocol.userId === session?.userId && (
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
            <div className="mt-3 flex flex-nowrap justify-between border-black">
              <div className="mt-1 flex flex-row post-options-box flex-wrap pl-1 border-red-500 inline-flex text-sm++">
                {/* SHARE PROTOCOL */}
                <div className="flex flex-row post-options-box flex-wrap pl-0.5 border-black text-sm++">
                  {/* SHARE PROTOCOL */}
                  <span className="">
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faShare}
                      className="cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                      onClick={() => console.log("share?")}
                    />
                    <span className="post-options ml-1.5 font-semibold text-purple-500 cursor-pointer">
                      share
                    </span>
                  </span>

                  {/* PROTOCOL COMMENTS ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faComment}
                    className="ml-6 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                    onClick={() => console.log("comment?")}
                  />

                  {/* PROTOCOL COMMENTS TEXT */}
                  <span
                    className="post-options ml-1.5 font-semibold text-purple-500 cursor-pointer"
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
                    {`${protocol.comments?.length || 0} ${
                      protocol.comments?.length === 1 ? "reply" : "replies"
                    }`}
                  </span>

                  {/* REPLY PROTOCOL ICON */}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faReply}
                    className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
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
                  />

                  {/* REPLY PROTOCOL TEXT */}
                  <span
                    className="post-options ml-1 font-semibold text-purple-500 cursor-pointer"
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
                    reply
                  </span>

                  {/* EDIT PROTOCOL ICON */}
                  {protocol.userId === session?.userId && editable && (
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faPen}
                      className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 inline-block align middle mt-0.25 invert-25 hover:invert-0"
                      onClick={() => {
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
                      }}
                    />
                  )}

                  {/* EDIT PROTOCOL TEXT */}
                  {protocol.userId === session?.userId && editable && (
                    <span
                      className="post-options ml-1 font-semibold text-purple-500 cursor-pointer"
                      onClick={() => {
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
                      }}
                    >
                      edit
                    </span>
                  )}

                  {/* DELETE PROTOCOL ICON */}
                  {protocol.userId === session?.userId && editable && (
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faTrash}
                      className="ml-5 cursor-pointer text-gray-600 hover:text-red-500 mt-0.25 invert-25 hover:invert-0"
                      onClick={(e) => handleDeleteProtocol(e)}
                    />
                  )}

                  {/* DELETE PROTOCOL TEXT */}
                  {protocol.userId === session?.userId && editable && (
                    <span
                      className="post-options ml-2 font-semibold text-purple-500 cursor-pointer"
                      onClick={(e) => handleDeleteProtocol(e)}
                    >
                      delete
                    </span>
                  )}
                </div>
              </div>
              {protocol.userId === session?.userId && editedProtocol.edit && (
                <span className="border-black">
                  <button
                    disabled={disableClick}
                    onClick={(e) => handleEditProtocol(e)}
                    className="text-gray-800 font-semibold cursor-pointer bg-purple-300 rounded-[0.15rem] px-2.5 py-0.5 border ring-1 ring-gray-400 border-zinc-400"
                  >
                    Save
                  </button>
                </span>
              )}

              {/* SHOW HIDE/SHOW ARROWS */}
              {!editedProtocol.edit && protocolBodyHeight > 134.5 && (
                <div className="border-black -mt-2.5 mr-3">
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

            {/* REPLY TO PROTOCOL BOX */}
            {replyProtocol.reply && protocol.userId === session?.userId && (
              <div>
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
    </DeletePostContext.Provider>
  );
};

export default Protocol;

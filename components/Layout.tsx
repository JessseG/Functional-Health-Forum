import { useState } from "react";
import Nav from "./nav";

const Layout = ({ children }) => {
  // 'children' refers to the entire content within <Layout></Layout> TAGS
  const [modal, setModal] = useState({
    display: "hidden",
    background: "opacity-100",
  });

  // useRef to toggle MODAL

  return (
    <div className="bg-black">
      <div
        className={`${modal.display} fixed h-screen w-screen z-10 border-yellow-400 flex items-center`}
      >
        <div className="h-1/6+ w-9/12 2xl:h-1/4 2xl:w-9/32 relative bg-white rounded-md mx-auto border-3 border-gray-500">
          <div className="ml-8 mt-6 text-xl font-semibold">Delete Post</div>
          <hr className="mx-7 my-2 h-0.5 mt-4 bg-gray-300" />
          <div className="ml-10 text-lg">
            Are you sure you want to delete this post?
          </div>
          <hr className="mx-7 my-3 h-0.5 bg-gray-300" />
          <div className="absolute bottom-3 right-5 flex justify-end border-red-500">
            <button className="border text-white bg-red-700 text-lg border-gray-500 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-red-800">
              Delete
            </button>
            <button className="ml-2 border text-white bg-gray-600 text-lg border-gray-700 rounded px-3 py-1 outline-none hover:scale-97 hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className={`border-red-700 ${modal.background}`}>
        <Nav />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

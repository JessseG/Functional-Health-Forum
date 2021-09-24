import "react-quill/dist/quill.snow.css";
import { useState } from "react";
// import ReactQuill from "react-quill";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

const modules = {
  toolbar: [
    ["bold", "italic"],
    ["link", "blockquote", "code", "image"],
    [
      {
        list: "ordered",
      },
      {
        list: "bullet",
      },
    ],
  ],
};

const Submit = () => {
  const [reactQuillText, setReactQuillText] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="w-2/3 m-auto container">
      <form action="">
        <input
          type="text"
          className="w-full border-2 mb-2 p-2 mt-8"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          value={reactQuillText}
          onChange={(value) => setReactQuillText(value)}
          theme="snow"
          className="w-full m-auto shadow-xl"
          modules={modules}
        />
        <button className="mt-4 border-2 text-white bg-gray-700 text-lg font-semibold border-gray-300 rounded-md px-4 py-1">
          Post
        </button>
        <button className="mt-4 ml-4 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-4 py-1">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Submit;

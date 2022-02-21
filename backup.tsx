{
  isNewPost && (
    <div className="w-full bg-white rounded-md px-4 py-4 pb-3.5 mt-4">
      <label className="block ml-4" />
      <div className="mb-3 pt-0">
        {/*  New Post Title */}
        <input
          autoFocus={focusWhere("title")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("title");
          }}
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              title: e.target.value,
            }))
          }
          className="autoFocus px-4 py-3 placeholder-gray-400 text-gray-600 relative ring-blue-300 ring-2 bg-white rounded-sm text-md border-0 shadow-md outline-none focus:outline-none w-full"
        />
      </div>
      <div className="mt-1.5 rounded-md border-gray-300 p-1 shadow-lg border-t relative">
        {/* <textarea
                    className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
                    rows={4}
                    placeholder="Content"
                  /> */}
        {/*  New Post Content */}
        <TextareaAutosize
          autoFocus={focusWhere("content")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("content");
          }}
          minRows={4}
          className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden relative resize-none"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              content: e.target.value,
            }))
          }
        />
        <div className="mt-3 mr-1 mb-1 flex justify-end absolute bottom-0.5 right-0.5">
          <button className="border-2 text-black bg-indigo-200 text-lg font-semibold border-gray-300 rounded-md px-3.5 py-0.5">
            Post
          </button>
          <button className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-0.5">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// _________________________________________________________________

{
  isNewPost && (
    <div className="w-full bg-white rounded-md px-4 py-4 pb-2.5 mt-4">
      <label className="block ml-4" />
      <div className="mb-3 pt-0">
        {/*  New Post Title */}
        <input
          autoFocus={focusWhere("title")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("title");
          }}
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              title: e.target.value,
            }))
          }
          className="autoFocus px-4 py-3 placeholder-gray-400 text-gray-600 relative ring-blue-300 ring-2 bg-white rounded-sm text-md border-0 shadow-md outline-none focus:outline-none w-full"
        />
      </div>
      <div className="mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-gray-300 ring-2 relative">
        {/* <textarea
                    className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
                    rows={4}
                    placeholder="Content"
                  /> */}
        {/*  New Post Content */}
        <TextareaAutosize
          autoFocus={focusWhere("content")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("content");
          }}
          minRows={4}
          className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden relative resize-none"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              content: e.target.value,
            }))
          }
        />
        <div className="mt-3 mr-1 mb-1 flex justify-end absolute bottom-0.5 right-0.5">
          <button className="border-2 text-black bg-indigo-200 text-lg font-semibold border-gray-300 rounded-md px-3.5 py-0.5">
            Post
          </button>
          <button className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-0.5">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// _______________________________________________________________

{
  isNewPost && (
    <div className="w-full bg-white rounded-md px-4 py-4 pb-2.5 mt-4">
      <label className="block ml-4" />
      <div className="mb-3 pt-0">
        {/*  New Post Title */}
        <input
          autoFocus={focusWhere("title")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("title");
          }}
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              title: e.target.value,
            }))
          }
          className="autoFocus px-4 py-3 placeholder-gray-400 text-gray-600 relative ring-blue-300 ring-2 bg-white rounded-sm text-md border-0 shadow-md outline-none focus:outline-none w-full"
        />
      </div>
      <div className="mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-gray-300 ring-2">
        {/* <textarea
                    className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
                    rows={4}
                    placeholder="Content"
                  /> */}
        {/*  New Post Content */}
        <TextareaAutosize
          autoFocus={focusWhere("content")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("content");
          }}
          minRows={4}
          className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              content: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-3 pr-0.5 flex justify-end">
        <button className="border-2 text-black bg-indigo-300 text-lg font-semibold border-gray-300 rounded-md px-3 py-0.75">
          Submit
        </button>
        <button className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-0.5">
          Cancel
        </button>
      </div>
    </div>
  );
}

// _________________________________________________________

{
  isNewPost && (
    <div className="w-full bg-white rounded-md px-4 py-4 pb-2.5 mt-4">
      <label className="block ml-4" />
      <div className="mb-3 pt-0">
        {/*  New Post Title */}
        <input
          autoFocus={focusWhere("title")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("title");
          }}
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              title: e.target.value,
            }))
          }
          className="autoFocus px-4 py-3 placeholder-gray-400 text-gray-600 relative ring-blue-300 ring-2 bg-white rounded-sm text-md border-0 shadow-md outline-none focus:outline-none w-full"
        />
      </div>
      <div className="mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-gray-300 ring-2">
        {/* <textarea
                    className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
                    rows={4}
                    placeholder="Content"
                  /> */}
        {/*  New Post Content */}
        <TextareaAutosize
          autoFocus={focusWhere("content")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("content");
          }}
          minRows={4}
          className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              content: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-3 pr-0.5 flex justify-end">
        <button className="border-2 text-white bg-gray-600 text-lg font-semibold border-gray-300 rounded-md px-3 py-0.75">
          Submit
        </button>
        <button className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-0.5">
          Cancel
        </button>
      </div>
    </div>
  );
}

// _____________________________________________________________

{
  isNewPost && (
    <div className="w-full bg-white rounded-md px-4 py-4 pb-2.5 mt-4">
      <label className="block ml-4" />
      <div className="mb-3 pt-0">
        {/*  New Post Title */}
        <input
          autoFocus={focusWhere("title")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("title");
          }}
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              title: e.target.value,
            }))
          }
          className="autoFocus px-4 py-3 placeholder-gray-400 text-gray-600 relative ring-blue-300 ring-2 bg-white rounded-sm text-md border-0 shadow-md outline-none focus:outline-none w-full"
        />
      </div>
      <div className="mt-1.5 rounded-sm border-blue-300 p-1 border-0 shadow-lg ring-gray-300 ring-2">
        {/* <textarea
                    className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
                    rows={4}
                    placeholder="Content"
                  /> */}
        {/*  New Post Content */}
        <TextareaAutosize
          autoFocus={focusWhere("content")}
          onFocus={(e) => {
            var val = e.target.value;
            e.target.value = "";
            e.target.value = val;
            setFocus("content");
          }}
          minRows={4}
          className="form-textarea block w-full px-3 py-1 outline-none overflow-hidden"
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setnewPost((state) => ({
              ...state,
              content: e.target.value,
            }))
          }
        />
      </div>
      <div className="mt-3 pr-0.5 flex justify-end">
        <button className="border-2 text-white bg-gray-600 text-lg font-semibold border-gray-300 rounded-md px-3.5 py-0.5">
          Post
        </button>
        <button className="ml-2 border-2 text-black bg-yellow-300 text-lg font-semibold border-gray-300 rounded-md px-2.5 py-0.5">
          Cancel
        </button>
      </div>
    </div>
  );
}

// _________________________________________________

//  old login.tsx

import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogin = () => {
    router.back();
    signIn();
    // this order cause next-auth redirects to main page
  };

  if (session) {
    router.push("/");
  }

  return (
    <Layout>
      <div>Log In to use this feature</div>
      <button onClick={() => handleLogin()}>Login</button>
      <button onClick={() => router.back()}>Go Back</button>
    </Layout>
  );
};

export default Login;

import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";

const Login = () => {
  const router = useRouter();
  const [session] = useSession();

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
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => router.back()}>Go Back</button>
    </Layout>
  );
};

export default Login;

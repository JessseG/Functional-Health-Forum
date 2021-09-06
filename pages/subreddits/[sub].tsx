import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";

const SubReddit = () => {
  const router = useRouter();
  const { sub } = router.query;

  return (
    <Layout>
      <h1>
        Welcome to <b>{sub}</b>
      </h1>
      <Link href="/">
        <a>Go Back</a>
      </Link>
    </Layout>
  );
};

export default SubReddit;

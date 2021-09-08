import Nav from "./Nav";

const Layout = ({ children }) => {
  // 'children' refers to the entire content within <Layout></Layout> TAGS
  return (
    <div>
      <Nav />
      <div>{children}</div>
    </div>
  );
};

export default Layout;

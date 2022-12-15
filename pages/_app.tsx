import "tailwindcss/tailwind.css";
import { SessionProvider } from "next-auth/react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./styles.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "antd/dist/antd.css"; // reservations
import { GlobalProvider } from "../components/GlobalContext";

// Binding events
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </SessionProvider>
  );
}

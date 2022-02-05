import "tailwindcss/tailwind.css";
import { SessionProvider } from "next-auth/react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./styles.css";

// Binding events
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

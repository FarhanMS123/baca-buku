import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import NavBar from "~/components/Navbar";
import { type NextComponentType, type NextPageContext } from "next";
import Dashboard from "~/components/page/dashboard";

type ComponentExtended = {
  theme?: string,
} & NextComponentType<NextPageContext, any, any>;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const theme = (Component as ComponentExtended).theme;
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Baca Buku</title>
        <meta name="description" content="Baca Buku merupakan Audio Book ditemani musik sintetis untuk meningkatkan minat membaca." />
        <link rel="icon" href="/favico.ico" />
      </Head>
      <NavBar />
      {(!theme || theme == "") && <Component {...pageProps} /> }
      {theme == "dashboard" && <Dashboard>
        <Component {...pageProps} />
      </Dashboard> }
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

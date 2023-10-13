import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useStore } from "@nanostores/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import NavBar from "~/components/Navbar";
import { type NextComponentType, type NextPageContext } from "next";
import Dashboard from "~/components/page/dashboard";
import { $main_theme, $use_theme } from "~/hooks/setting";
import { useEffect, useRef, useState } from "react";
import { Audio } from "@prisma/client";

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
      <SeperateSession />
      <NavBar />

      {(!theme || theme == "") && <Component {...pageProps} /> }

      {theme == "dashboard" && <Dashboard>
        <Component {...pageProps} />
      </Dashboard> }

    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

function SeperateSession() {
  const [ready, setReady] = useState(false);
  const mainTheme = useStore($main_theme);
  const isTheme = useStore($use_theme);

  const { data: themes } = api.audio.getAudios.useQuery("main_theme", { enabled: Object.keys(mainTheme).length == 0 });

  const refAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (Object.keys($main_theme.get()).length == 0 && themes?.[0]) 
      $main_theme.set(themes[0]);

  }, [mainTheme, isTheme, themes]);

  useEffect(() => {
    setReady(true);

    const handle = () => {
      refAudio.current?.play();
      if (!refAudio.current?.paused) document.removeEventListener("click", handle);
    };

    document.addEventListener("click", handle);

    refAudio.current?.load();

    return () => document.removeEventListener("click", handle);

  }, [refAudio, mainTheme, isTheme]);

  if (!ready) return <></>;

  return <>
    {Boolean(mainTheme?.blob_url) && isTheme && 
    <audio ref={refAudio} autoPlay>
      <source src={mainTheme.blob_url} />
    </audio>}
  </>;
}

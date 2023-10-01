import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Baca Buku</title>
        <meta name="description" content="Baca Buku merupakan Audio Book ditemani musik sintetis untuk meningkatkan minat membaca." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        
      </main>
    </>
  );
}
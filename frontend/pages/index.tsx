import { UserContext } from "@/utils/UserContext";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Head>
        <title>Rule Breaker</title>
        <meta name="description" content="Break the rules just a little bit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#2f6690" />
        <meta name="theme-color" content="#84b3d7" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </div>
  );
}
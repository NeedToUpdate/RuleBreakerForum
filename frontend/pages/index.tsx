import PostViewer from "@/components/PostViewer";
import { UserContext } from "@/utils/UserContext";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";

interface Props {
  initialPosts: Post[];
}

export default function Home({ initialPosts }: Props) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-secondary-200 dark:bg-secondary-900">
      <Head>
        <title>Rule Breaker</title>
        <meta name="description" content="Break the rules just a little bit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#2f6690" />
        <meta name="theme-color" content="#84b3d7" />
      </Head>

      <main className="flex min-h-screen flex-col p-5">
        <PostViewer initialPosts={initialPosts} />
      </main>
    </div>
  );
}
export async function getServerSideProps() {
  let initialPosts: Post[] | null = null;
  try {
    // Call an external API endpoint to get posts.
    const response = await axios.get(`${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URI}/posts`);
    initialPosts = response.data;
  } catch (e) {
    //pass
  }
  return {
    props: {
      initialPosts: initialPosts || [],
    },
  };
}

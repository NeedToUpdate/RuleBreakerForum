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
    <div className=" w-full min-h-screen flex flex-col bg-secondary-200 dark:bg-secondary-900">
      <Head>
        <title>Rule Breaker</title>
        <meta name="description" content="Break the rules just a little bit." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#2f6690" />
        <meta name="theme-color" content="#84b3d7" />
      </Head>

      <main className="flex min-h-screen flex-col p-5">
        <div className="mb-5 border-2 border-highlight-700 dark:border-highlight-500 rounded-md flex justify-center items-center p-5 bg-secondary-300 dark:bg-secondary-800 text-black dark:text-white font-thin text-lg">
          <p>Create your own post or join one of the ones below! ChatGPT will moderate each post based on the rules given. See if you can break the rules! If you can make 3 comments, you can add your own rule.</p>
        </div>
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

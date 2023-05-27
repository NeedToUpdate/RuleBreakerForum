import PostViewer from "@/components/PostViewer";
import axios from "axios";
import Head from "next/head";

interface Props {
  initialPosts: Post[];
}

export default function Home({ initialPosts }: Props) {
  return (
    <div className=" w-full min-h-screen flex flex-col bg-secondary-200 dark:bg-secondary-900">
      <Head>
        <title>Rule Breaker</title>
        <meta name="title" content="RuleBreaker" />
        <meta name="description" content="See if you can break some rules!" />
        <meta name="keywords" content="chatgpt, forum, ai" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#023436" />
        <meta name="apple-mobile-web-app-title" content="RuleBreaker Forums" />
        <meta name="application-name" content="RuleBreaker Forums" />
        <meta name="msapplication-TileColor" content="#023436" />
        <meta name="theme-color" content="#023436" />
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

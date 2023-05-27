import { useRouter } from "next/router";
import React from "react";

interface Props {
  post: Post;
}

export default function Post(props: Props) {
  const { post } = props;
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/posts/${post.id}`)}
      className="w-full px-5 py-2 bg-primary-200 dark:bg-primary-800 gap-5 rounded-md flex flex-col text-secondary-900 dark:text-white cursor-pointer shadow-none border-highlight-800 dark:border-highlight-500 border-x-2 hover:shadow-lg shadow-highlight-700 dark:shadow-highlight-400 hover:translate-y-[-1px]  duration-150"
    >
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="capitalize text-md font-thin opacity-80">{post.rules.map((x) => x[1]).join(", ")}</p>
      <div className="flex justify-between text-sm">
        <p className="font-thin">Comments: {post.comments_num}</p>
        <button>Go to Post</button>
      </div>
    </div>
  );
}

import React, { FormEvent, useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "@/utils/UserContext";
import Button from "@/components/Basic/Button";
import { useRouter } from "next/router";
import Head from "next/head";

export default function CreatePost() {
  const { logout } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [rule, setRule] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const post = await axios.post("/api/posts", {
        title,
        rule,
      });
      setLoading(false);
      setRule("");
      setTitle("");
      router.push("/posts/" + post.data.id);
      // Redirect to home page or somewhere else after successful post creation
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logout();
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary-200 dark:bg-secondary-900 w-full">
      <Head>
        <title>Rule Breaker | Create Post</title>
      </Head>
      <form className="flex flex-col p-5 bg-primary-300 dark:bg-primary-800 dark:text-white gap-5 justify-center items-center">
        <input
          className="block p-2.5 w-full text-sm text-black bg-secondary-50 rounded-lg border border-secondary-300 focus:ring-highlight-500 focus:border-highlight-500 dark:bg-secondary-900 dark:border-secondary-600 dark:placeholder-secondary-400 dark:text-white dark:focus:ring-highlight-500 dark:focus:border-highlight-500"
          type="text"
          placeholder="Title"
          value={title}
          maxLength={40}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          id="message"
          rows={4}
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          required
          className="block p-2.5 w-full text-sm text-black bg-secondary-50 rounded-lg border border-secondary-300 focus:ring-highlight-500 focus:border-highlight-500 dark:bg-secondary-900 dark:border-secondary-600 dark:placeholder-secondary-400 dark:text-white dark:focus:ring-highlight-500 dark:focus:border-highlight-500"
          draggable={false}
          placeholder="Rule"
          maxLength={40}
        ></textarea>
        <Button disabled={!rule.length || !title.length || loading} onClick={() => handleSubmit()}>
          Create Post
        </Button>
      </form>
    </div>
  );
}

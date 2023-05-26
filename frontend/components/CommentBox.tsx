import axios from "axios";
import React, { FormEvent, useState } from "react";
import Button from "./Basic/Button";

interface Props {
  postId: string;
  parentId?: string;
  onCreate: (comment: Comment) => void;
}

export default function CommentBox(props: Props) {
  const { parentId, postId } = props;

  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const comment = {
      body,
      postId,
      parentId,
    };

    try {
      setLoading(true);
      setBody(""); // clear the input box after successful submission
      const data = await axios.post("/api/comments", comment);
      props.onCreate(data.data as Comment);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setBody(comment.body);
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-5 justify-center items-center p-5">
      <textarea
        id="message"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="block p-2.5 w-full text-sm text-secondary-900 bg-secondary-50 rounded-lg border border-secondary-300 focus:ring-highlight-500 focus:border-highlight-500 dark:bg-secondary-700 dark:border-secondary-600 dark:placeholder-secondary-400 dark:text-white dark:focus:ring-highlight-500 dark:focus:border-highlight-500"
        draggable={false}
        placeholder="Write a comment, try not to be banned by chatGPT!"
      ></textarea>

      <Button disabled={!body.length || loading} onClick={() => handleSubmit()}>
        Submit
      </Button>
    </form>
  );
}

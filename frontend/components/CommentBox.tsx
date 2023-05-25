import axios from "axios";
import React, { FormEvent, useState } from "react";

interface Props {
  postId: string;
  parentId?: string;
}

export default function CommentBox({ parentId, postId }: Props) {
  const [body, setBody] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const comment = {
      body,
      postId,
      parentId,
    };

    try {
      await axios.post("/api/comments", comment);

      setBody(""); // clear the input box after successful submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
      <button type="submit">Submit</button>
    </form>
  );
}

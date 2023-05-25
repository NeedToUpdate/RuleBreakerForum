import axios from "axios";
import React, { FormEvent, useState } from "react";

interface Props {
  postId: string;
  parentId?: string;
  onCreate: (comment: Comment) => void;
}

export default function CommentBox(props: Props) {
  const { parentId, postId } = props;

  const [body, setBody] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const comment = {
      body,
      postId,
      parentId,
    };

    try {
      setBody(""); // clear the input box after successful submission
      const data = await axios.post("/api/comments", comment);
      props.onCreate(data.data as Comment);
    } catch (error) {
      console.error(error);
      setBody(comment.body);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
      <button type="submit">Submit</button>
    </form>
  );
}

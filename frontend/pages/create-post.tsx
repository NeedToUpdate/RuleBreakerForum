import React, { FormEvent, useState } from "react";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [rule, setRule] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/api/posts", {
        title,
        rule,
      });

      // Redirect to home page or somewhere else after successful post creation
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Rule" value={rule} onChange={(e) => setRule(e.target.value)} />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

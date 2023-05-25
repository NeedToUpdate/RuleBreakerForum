import React, { FormEvent, useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "@/utils/UserContext";

export default function CreatePost() {
  const { logout } = useContext(UserContext);
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
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logout();
      }
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

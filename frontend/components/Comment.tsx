import { UserContext } from "@/utils/UserContext";
import React, { useContext } from "react";

interface Props {
  comment: Comment;
}

const Comment = ({ comment }: Props) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <p>Comment: {comment.body}</p>
      <p>Rule Broken: {comment.ruleBroken || "None"}</p>
      <p>User: {comment.userId === user?._id ? "You" : comment.userId}</p>
    </div>
  );
};

export default Comment;

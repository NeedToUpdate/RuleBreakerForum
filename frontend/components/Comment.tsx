import React from "react";

interface Props {
  comment: Comment;
}

const Comment = ({ comment }: Props) => {
  return (
    <div>
      <p>Comment: {comment.body}</p>
      <p>User: {comment.userId}</p>
    </div>
  );
};

export default Comment;

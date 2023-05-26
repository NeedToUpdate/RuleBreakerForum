import React from "react";
import Comment from "./Comment";

interface Props {
  comments: Comment[];
}

const Comments = ({ comments }: Props) => {
  return (
    <div className="flex flex-col gap-2 p-5">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;

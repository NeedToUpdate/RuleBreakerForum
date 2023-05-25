import React from "react";
import Comment from "./Comment";

interface Props {
  comments: Comment[];
}

const Comments = ({ comments }: Props) => {
  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => <Comment comment={comment} />);
  };

  return <div>{renderComments(comments)}</div>;
};

export default Comments;

import { UserContext } from "@/utils/UserContext";
import React, { useContext } from "react";

interface Props {
  comment: Comment;
}

const Comment = ({ comment }: Props) => {
  const { user } = useContext(UserContext);
  return (
    <div className="w-full px-5 py-2 rounded-md border-x-2 border-highlight-700 dark:border-highlight-500 bg-primary-100 dark:bg-primary-800 text-secondary-900 dark:text-white">
      <p>{comment.body}</p>
      <div className="flex flex-row justify-between align-end">
        {comment.ruleBroken !== null && comment.ruleBroken !== undefined && <p className="text-amber-500">Rule Broken: {comment.ruleBroken}</p>}
        <div className="flex-1"></div>
        <p className="text-xs opacity-80">{comment.userId === user?._id ? "You" : comment.userId}</p>
      </div>
    </div>
  );
};

export default Comment;

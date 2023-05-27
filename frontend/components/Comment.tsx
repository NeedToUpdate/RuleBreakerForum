import { UserContext } from "@/utils/UserContext";
import axios from "axios";
import React, { useContext } from "react";

interface Props {
  comment: Comment;
}

const Comment = ({ comment }: Props) => {
  const { user } = useContext(UserContext);
  const fetchUser = async (id: string) => {
    const response = await axios.get(`/api/users/${id}`)
    console.log(response.data)
  }
  return (
    <div onClick={() => {
      fetchUser(comment.userId)
    }} className="w-full px-5 py-2 rounded-md border-x-2 border-highlight-700 dark:border-highlight-500 bg-primary-100 dark:bg-primary-800 text-secondary-900 dark:text-white">
      <p>{comment.body}</p>
      <div className="flex flex-row justify-between items-end">
        <div>{comment.ruleBroken !== null && comment.ruleBroken !== undefined && <p className="text-amber-500">Rule Broken: {comment.ruleBroken}</p>}</div>
        <div className="flex-1"></div>
        <div className="flex items-end">
          <p className="text-xs opacity-80 m-0">{comment.userId === user?._id ? "You" : comment.userId}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;

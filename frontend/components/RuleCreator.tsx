import { UserContext } from "@/utils/UserContext";
import axios from "axios";
import React, { FormEvent, useContext, useState } from "react";

interface Props {
  onCreate: (rule: string) => void;
  postId: string;
  commentsMade: number;
}

export default function RuleCreator(props: Props) {
  const { postId, commentsMade } = props;
  const { user } = useContext(UserContext);
  const [rule, setRule] = useState("");

  const addRule = async () => {
    try {
      const response = await axios.patch(
        `/api/posts/${postId}/addRule`, // Your API route
        { rule, userId: user?._id }
      );

      // The response data will be available here if the request was successful
      console.log(response.data);
      props.onCreate(rule);
    } catch (error) {
      console.error(error);
    }
  };
  // Form submit handler
  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault(); // Prevent page reload
    addRule(); // Send the PATCH request
    setRule(""); // Clear the textarea
  };
  if (!user) {
    return <></>;
  }

  return (
    <form onSubmit={handleSubmit} className="absolute flex flex-col bottom-10 right-10 w-[80vw] max-w-[300px] p-10 bg-secondary-300 dark:bg-secondary-700 border-2 border-highlight-800 dark:border-highlight-400 rounded-md">
      <p>
        You have made {commentsMade} comment{commentsMade === 1 ? "" : "s"}, you can add a new rule!
      </p>
      <textarea className="w-full h-full" name="rule" draggable={false} cols={10} rows={10} value={rule} onChange={(ev) => setRule(ev.target.value)}></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

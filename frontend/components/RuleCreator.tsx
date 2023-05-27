import { UserContext } from "@/utils/UserContext";
import axios from "axios";
import React, { FormEvent, useContext, useState } from "react";
import Button from "./Basic/Button";

interface Props {
  onCreate: (rule: string) => void;
  postId: string;
  commentsMade: number;
}

export default function RuleCreator(props: Props) {
  const { postId, commentsMade } = props;
  const { user } = useContext(UserContext);
  const [rule, setRule] = useState("");
  const [loading, setLoading] = useState(false);

  const addRule = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/posts/${postId}/addRule`, // Your API route
        { rule, userId: user?._id }
      );

      props.onCreate(rule);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  // Form submit handler
  const handleSubmit = () => {
    addRule(); // Send the PATCH request
    setRule(""); // Clear the textarea
  };
  if (!user) {
    return <></>;
  }

  return (
    <form className="fixed flex flex-col bottom-10 right-10 w-[80vw] max-w-[300px] p-5 gap-5 bg-primary-300 dark:bg-primary-800 border-2 border-highlight-800 dark:border-highlight-400 rounded-md">
      <p className="dark:text-white">
        You have made {commentsMade} comment{commentsMade === 1 ? "" : "s"}, you can add a new rule!
      </p>
      <textarea
        id="message"
        rows={4}
        value={rule}
        onChange={(e) => setRule(e.target.value)}
        required
        className="block p-2.5 w-full text-sm text-black bg-secondary-50 rounded-lg border border-secondary-300 focus:ring-highlight-500 focus:border-highlight-500 dark:bg-secondary-900 dark:border-secondary-600 dark:placeholder-secondary-400 dark:text-white dark:focus:ring-highlight-500 dark:focus:border-highlight-500"
        draggable={false}
        placeholder="Rule"
        maxLength={40}
      ></textarea>
      <Button disabled={!rule.length || loading} onClick={() => handleSubmit()}>
        Create Rule
      </Button>
    </form>
  );
}

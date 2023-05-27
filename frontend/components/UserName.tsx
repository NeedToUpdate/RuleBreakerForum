import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UsernameContext } from "@/utils/UserNameContext";

interface Props {
  userId: string;
}

export default function Username({ userId }: Props) {
  const { usernames, setUsername } = useContext(UsernameContext);
  const [username, setUsernameLocal] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsername = async () => {
      if (usernames.has(userId)) {
        setUsernameLocal(usernames.get(userId) || "");
      } else {
        try {
          const response = await axios.get(`/api/users/${userId}`, { signal: controller.signal });
          setUsername(userId, response.data.username);
          setUsernameLocal(response.data.username);
        } catch (error) {
          if (axios.isAxiosError(error) && error.name === "CanceledError") {
            return;
          }
          console.error("Failed to fetch username");
        }
      }
    };
    const timeout = setTimeout(() => {
      fetchUsername();
    }, Math.random() * 500);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [userId, usernames, setUsername]);

  return <>{username || userId}</>;
}

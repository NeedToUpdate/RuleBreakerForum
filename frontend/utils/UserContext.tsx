import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    // Clear the user state
    setUser(null);

    // Clear the user token from the cookie
    Cookies.remove("auth_token");
  };
  useEffect(() => {
    // Parse the JWT token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("url: ", urlParams.get("token"));
    console.log("cookie: ", Cookies.get("auth_token"));
    const token = urlParams.get("token") || Cookies.get("auth_token");
    const validateAndSetUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URI}/auth/validate?token=${token}`);

          if (response.status === 200) {
            // Save the token in a cookie
            Cookies.set("auth_token", token);

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URI}/auth/session`);

            if (userResponse.status === 200) {
              setUser(userResponse.data);
            }
          }
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }
    };

    validateAndSetUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UsernameModal from "@/components/UsernameModal";
// import UsernameModal from './UsernameModal'; // assuming you have this modal component

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
  const [showModal, setShowModal] = useState(false);
  const [ userNameLoading, setUserNameLoading ] = useState(false)

  const logout = () => {
    // Clear the user state
    setUser(null);

    // Clear the user token from the cookie
    Cookies.remove("auth_token");
  };

  const updateUser = async (username: string) => {
    // update user with PUT request
    if (user) {
      setUserNameLoading(true)
      try {
        await axios.put(`/api/users/${user._id}`, { username });
        setUserNameLoading(false)
        setUser(old => (old ? { ...old, username: username } : null))
        setShowModal(false)
      } catch (error) {
        console.error("Error updating username:", error);
        setUserNameLoading(false)
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || Cookies.get("auth_token");
    const validateAndSetUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URI}/auth/validate?token=${token}`);

          if (response.status === 200) {
            Cookies.set("auth_token", token);

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URI}/auth/session`);

            if (userResponse.status === 200) {
              setUser(userResponse.data);
              // Check if username is $no_name and show modal
              if (userResponse.data.username === '$no_name') {
                setShowModal(true);
              }
            }
          }
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }
    };

    validateAndSetUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
      {showModal && <UsernameModal onConfirm={updateUser} loading={userNameLoading} onClose={() => setShowModal(false)} />}
    </UserContext.Provider>
  );
}

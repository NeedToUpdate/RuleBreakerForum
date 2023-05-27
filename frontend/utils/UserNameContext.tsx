import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface UsernameContextValue {
  usernames: Map<string, string>;
  setUsername: (id: string, username: string) => void;
}

export const UsernameContext = createContext<UsernameContextValue>({
  usernames: new Map(),
  setUsername: () => {},
});

export default function UsernameProvider({ children }:{children:React.ReactNode}){
  const [usernames, setUsernames] = useState<Map<string, string>>(new Map());

  const setUsername = (id: string, username: string) => {
    setUsernames(new Map(usernames.set(id, username)));
  };

  return (
    <UsernameContext.Provider value={{ usernames, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};
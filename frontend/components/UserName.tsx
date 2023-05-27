import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UsernameContext } from '@/utils/UserNameContext';

interface Props {
    userId: string;
}

export default function Username({ userId }:Props){
  const { usernames, setUsername } = useContext(UsernameContext);
  const [username, setUsernameLocal] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (usernames.has(userId)) {
        setUsernameLocal(usernames.get(userId) || '');
      } else {
        try {
          const response = await axios.get(`/api/users/${userId}`);
          setUsername(userId, response.data.username);
          setUsernameLocal(response.data.username);
        } catch (error) {
          console.error('Failed to fetch username', error);
        }
      }
    };

    fetchUsername();
  }, [userId, usernames, setUsername]);

  return <>{username || userId}</>;
};

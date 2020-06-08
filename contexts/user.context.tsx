import { useRouter } from 'next/router';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const UserContextProvider = (props) => {
  const [user, setUser] = useState({});
  const [fetched, setFetched] = useState(false);
  const router = useRouter();

  const storeUser = (user) => {
    setUser(user);
  };

  const logout = () => {
    if (typeof document != 'undefined') {
      document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    }

    setUser({});

    router.push('/').catch();
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch('/api/me');

      if (res.status !== 200) {
        return;
      }

      const newData = await res.json();

      setUser(newData);
      setFetched(true);
    }

    getData().catch();
  }, []);

  return (
    <UserContext.Provider value={{ user, storeUser, logout, fetched }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;

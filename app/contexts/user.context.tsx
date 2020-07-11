import { useRouter } from 'next/router';
import React, { createContext, useEffect, useState } from 'react';

interface IUserProfile {
  _id: string;
  username: string;
  avatarUrl: string;
  localeCode: string;
}

interface IUserContext {
  user?: IUserProfile;
  fetched: boolean;
  logout: () => void;
  storeUser: (user: IUserProfile) => void;
}

export const UserContext = createContext<IUserContext>(null);

const getProfile = () => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem('profile');
    return (item && JSON.parse(item)) || null;
  }
  return null;
};

const setProfile = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profile', JSON.stringify(data));
  }
};

const UserContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUserProfile>(getProfile());
  const [fetched, setFetched] = useState(false);
  const router = useRouter();

  const storeUser = (usr: IUserProfile) => {
    setUser(usr);
  };

  const logout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    setProfile(null);
    setUser(null);
    router.push('/').catch();
  };

  useEffect(() => {
    if (user && user.profile) {
      return;
    }

    async function getData() {
      const query = `query {
        profile: myProfile {
          _id
          username
          avatarUrl
          localeCode
        }
      }`;
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (res.status !== 200) {
        return;
      }

      const { data, errors } = await res.json();

      if (!errors) {
        setProfile(data.profile);
        setUser(data.profile);
        setFetched(true);
      }
    }

    getData().catch();
  }, []);

  return (
    <UserContext.Provider value={{ user, storeUser, logout, fetched }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

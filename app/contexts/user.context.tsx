import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { createContext } from 'react';

const USER_CONTEXT = gql`
  query UserContextQuery {
    profile: myProfile {
      _id
      username
      avatarUrl
      localeCode
    }
  }
`;

interface IUserProfile {
  _id: string;
  username: string;
  avatarUrl: string;
  localeCode: string;
}

interface IUserContext {
  user?: IUserProfile;
  loading?: boolean;
  logout: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);

const UserContextProvider: React.FC = ({ children }) => {
  const { loading, data } = useQuery(USER_CONTEXT);
  const router = useRouter();

  return (
    <UserContext.Provider
      value={{
        user: (data && data.profile) || {},
        logout: () => router.push('/api/logout'),
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

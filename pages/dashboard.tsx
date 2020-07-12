import { Button, PageHeader } from 'antd';
import ConnectCommunityBox from 'app/components/connect-community-box';
import UserCommunityList from 'app/components/user-community-list';
import { UserContext } from 'app/contexts/user.context';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { logout, user } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="robots" content="noindex, noarchive" />
      </Head>
      {user && (
        <div className="wrapper">
          <PageHeader
            className="page-header"
            title="Dashboard"
            extra={[
              <Button
                key="user-profile"
                onClick={() => router.push(`/users/${user._id}`)}
              >
                My Profile
              </Button>,
              <Button key="logout" onClick={() => logout()}>
                Log out
              </Button>,
            ]}
          />
          <UserCommunityList />
          <ConnectCommunityBox />
        </div>
      )}
    </>
  );
};

export default DashboardPage;

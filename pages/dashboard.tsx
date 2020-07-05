import UserCommunityList from 'app/components/user-community-list';
import React, { useContext } from 'react';
import Head from 'next/head';
import { Button, PageHeader } from 'antd';
import { UserContext } from 'app/contexts/user.context';
import { useRouter } from 'next/router';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { logout, user } = useContext(UserContext);

  const content = user && (
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
      <UserCommunityList userId={user && user._id} />
    </div>
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      {content}
    </>
  );
};

export default DashboardPage;

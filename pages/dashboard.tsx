import { PageHeader, Typography } from 'antd';
import ConnectCommunityBox from 'app/components/connect-community-box';
import UserCommunityList from 'app/components/user-community-list';
import { UserContext } from 'app/contexts/user.context';
import Head from 'next/head';
import React, { useContext } from 'react';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>My Dashboard</title>
        <meta name="robots" content="noindex, noarchive" />
      </Head>
      {user && user._id && (
        <div className="wrapper">
          <Title level={1} style={{ marginTop: 30 }}>
            Dashboard
          </Title>
          <PageHeader className="page-header" title="Memberships">
            <UserCommunityList userProfileId={user._id} />
          </PageHeader>
          <ConnectCommunityBox />
        </div>
      )}
    </>
  );
};

export default DashboardPage;

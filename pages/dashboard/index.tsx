import React, { useContext } from 'react';
import Head from 'next/head';
import { Button, PageHeader } from 'antd';
import { UserContext } from 'app/contexts/user.context';

const DashboardPage: React.FC = () => {
  const { logout } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="wrapper">
        <PageHeader
          className="page-header"
          title="Dashboard"
          breadcrumb={{ routes: [{ path: '/', breadcrumbName: 'Home' }] }}
          extra={[
            <Button key="1" onClick={() => logout()}>
              Log out
            </Button>,
          ]}
        />
      </div>
    </>
  );
};

export default DashboardPage;

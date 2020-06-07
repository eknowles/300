import BrochureLayout from 'components/layout';
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Button, PageHeader, Statistic, Space } from 'antd';
import { UserContext } from '../../contexts/user.context';

const DashboardPage = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <BrochureLayout>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="wrapper">
        <PageHeader
          className="page-header"
          title="Dashboard"
          extra={[
            <Button key="1" onClick={() => logout()}>Log out</Button>
          ]}
        >
          <Space size="large">
            <Statistic title="Primary Community" prefix="" value="Hyph" />
            <Statistic title="Member Since" value="Jan 2020" />
          </Space>
        </PageHeader>
      </div>
    </BrochureLayout>
  );
};

export default DashboardPage;

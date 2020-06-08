import BrochureLayout from 'components/layout';
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { ApartmentOutlined, PartitionOutlined } from '@ant-design/icons';
import { Typography, Button, PageHeader, Statistic, Space, Col, Row, Divider, Card } from 'antd';
import { UserContext } from 'contexts/user.context';

const { Title } = Typography;

const DashboardPage = () => {
  const { logout } = useContext(UserContext);

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
        />
      </div>

      <div className="wrapper">
        <Title>Select an option</Title>
        <Row gutter={20} align={'middle'}>
          <Col span={12}>
            <Button size="large" block style={{ height: '200px' }} icon={<PartitionOutlined />}>
              I want to join a community
            </Button>
          </Col>
          <Col span={12}>
            <Button size="large" block style={{ height: '200px' }} icon={<ApartmentOutlined />}>
              I manage an existing community
            </Button>
          </Col>
        </Row>
      </div>
    </BrochureLayout>
  );
};

export default DashboardPage;

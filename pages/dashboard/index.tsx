import Link from 'next/link';
import React, { useContext } from 'react';
import Head from 'next/head';
import { ApartmentOutlined, PartitionOutlined } from '@ant-design/icons';
import { Button, PageHeader, Divider, Row, Col } from 'antd';
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

      <div className="wrapper">
        <Row align="middle" gutter={24}>
          <Col span={10}>
            <Button size="large" block icon={<PartitionOutlined />}>
              I want to join a community
            </Button>
          </Col>
          <Col span={4}>
            <Divider>or</Divider>
          </Col>
          <Col span={10}>
            <Link href="/communities/connect">
              <Button size="large" block icon={<ApartmentOutlined />}>
                I manage an existing community
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardPage;

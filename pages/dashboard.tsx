import UserCommunityList from 'app/components/user-community-list';
import React, { useContext } from 'react';
import Head from 'next/head';
import { Button, Col, PageHeader, Row, Typography } from 'antd';
import { UserContext } from 'app/contexts/user.context';
import { useRouter } from 'next/router';

const { Title, Paragraph } = Typography;

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
      <Row>
        <Col span={12}>
          <div style={{ margin: '5em 0' }}>
            <Title level={4}>Connect your Community</Title>
            <Paragraph>
              Create subscriptions to support your growth and pay for services
              like game servers and hosting. As a platform we can help you
              manage your organisation, grow your membership and automate
              onboarding, allocating benefits and more.
            </Paragraph>
            <Paragraph>
              Our mission is to help small and medium sized communities grow
              their membership and become self supporting.
            </Paragraph>
            <Button
              type="primary"
              onClick={() => router.push('/communities/connect')}
            >
              Invite Discord Bot
            </Button>
          </div>
        </Col>
      </Row>
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

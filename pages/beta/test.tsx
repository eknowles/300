import { Space, Steps, Typography, Alert, Card, Avatar } from 'antd';
import React from 'react';
import Head from 'next/head';
import { UserOutlined } from '@ant-design/icons';

import CommunityCards from 'app/components/community-cards';

const { Title } = Typography;
const { Step } = Steps;

const TestPage: React.FC = () => (
  <>
    <Head>
      <title>300.team</title>
    </Head>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card bordered={false}>
        <div className="wrapper">
          <Steps direction="horizontal" current={0} onChange={() => 1}>
            <Step
              title="Sign up"
              subTitle="Discord"
              description="Create your account"
            />
            <Step
              title="Subscribe"
              subTitle="PayPal"
              description="Buy a subscription"
            />
            <Step title="Join Club" description="Find your clan" />
            <Step title="Join Squad" description="Make new friends" />
          </Steps>
        </div>
      </Card>

      <div style={{ textAlign: 'center' }}>
        <Title>Communities Made Simple</Title>
        <Title level={2}>a subscription platform for growing communities</Title>
        <Title level={2}>subscription manager for your club</Title>
        <Title level={2}>
          grow your community with managed subscriptions and automated
          on-boarding
        </Title>
      </div>

      <div className="wrapper">
        <Alert type="success" message="yo" banner closable />
        <Alert type="error" message="yo" banner closable />
        <Alert type="info" message="yo" banner closable />
        <Alert type="warning" message="yo" banner closable />
      </div>

      <div className="wrapper">
        <div>
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <div>
          <Avatar
            size={32}
            src="https://pbs.twimg.com/profile_images/1148549536102723584/hqJGdlUa.png"
          />
          <Avatar
            size={32}
            src="https://pbs.twimg.com/profile_images/1114098540375150592/KBoDdl1J.png"
          />
          <Avatar
            size={32}
            src="https://pbs.twimg.com/profile_images/1005774842136842241/gjk2TQkK.jpg"
          />
          <Avatar
            size={32}
            src="https://pbs.twimg.com/profile_images/1262186615121813504/LF_CchGr.jpg"
          />
          <Avatar
            size={32}
            src="https://pbs.twimg.com/profile_images/1187459671180955649/B3HMWS5S.jpg"
          />
        </div>
      </div>

      <div className="wrapper">
        <div style={{ textAlign: 'center' }}>
          <Title>Featured Communities</Title>
        </div>
        <CommunityCards />
      </div>
    </Space>
  </>
);

export default TestPage;
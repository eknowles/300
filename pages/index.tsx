import { Button, Space, Steps, Typography } from 'antd';
import React from 'react';
import Head from 'next/head';
import { Card, Avatar } from 'antd';

import './index.less';
import BattalionCards from '../components/battalion-cards';

const { Title } = Typography;
const { Step } = Steps;

const Home = () => (
  <div>
    <Head>
      <title>300.team</title>
    </Head>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>

      <Card>
        <div className="wrapper">
          <Steps direction="horizontal" current={0} onChange={() => 1}>
            <Step title="Sign up" subTitle="Discord" description="Create your account" />
            <Step title="Subscribe" subTitle="PayPal" description="Buy a subscription" />
            <Step title="Join Battalion" description="Find your clan" />
            <Step title="Join Platoon" description="Make new friends" />
          </Steps>
        </div>
      </Card>

      <div className="wrapper">
        <div className="header">
          <div className="logo">
            <div className="brand">300<span>.team</span></div>
            <div className="motto"><span>Communities Made Simple</span></div>
          </div>
          <div className="auth">
            <Button type="primary" size="large">Sign in with Discord</Button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Title>✌ Communities Made Simple ✌</Title>
        <div></div>
      </div>

      <div className="wrapper">
      </div>

      <div className="wrapper">
        {/*<BattalionCards />*/}
      </div>
    </Space>
  </div>
);

export default Home;

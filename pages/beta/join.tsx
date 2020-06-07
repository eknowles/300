import { Button, Space, Steps, Typography } from 'antd';
import React from 'react';
import Head from 'next/head';
import { Card, Avatar } from 'antd';
import Footer from 'components/footer';

const { Title } = Typography;
const { Step } = Steps;

const JoinPage = () => (
  <div>
    <Head>
      <title>Join | 300.team</title>
    </Head>
    <div className="wrapper">
      <Card title="Join 300.team">
        <Space size="large" align="center" style={{ width: '100%' }}>
          <Steps direction="vertical" current={0} onChange={() => 1}>
            <Step title="Sign up" subTitle="Discord" description="Create your account" />
            <Step title="Subscribe" description="Pick a plan for you" />
            <Step title="Join Battalion" description="Find your clan" />
            <Step title="Join Platoon" description="Make new friends" />
          </Steps>
          <Button type="primary" size="large">Connect with Discord</Button>
        </Space>
      </Card>
    </div>

    <Footer />
  </div>
);

export default JoinPage;

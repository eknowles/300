import { Button, Space, Steps, Card } from 'antd';
import React from 'react';
import Head from 'next/head';

import Footer from 'app/components/footer';

const { Step } = Steps;

const JoinPage: React.FC = () => (
  <div>
    <Head>
      <title>Join | 300.team</title>
    </Head>
    <div className="wrapper">
      <Card title="Join 300.team">
        <Space size="large" align="center" style={{ width: '100%' }}>
          <Steps direction="vertical" current={0} onChange={() => 1}>
            <Step
              title="Sign up"
              subTitle="Discord"
              description="Create your account"
            />
            <Step title="Subscribe" description="Pick a plan for you" />
            <Step title="Join Battalion" description="Find your clan" />
            <Step title="Join Platoon" description="Make new friends" />
          </Steps>
          <Button type="primary" size="large">
            Connect with Discord
          </Button>
        </Space>
      </Card>
    </div>

    <Footer />
  </div>
);

export default JoinPage;

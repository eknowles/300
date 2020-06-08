import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import BrochureLayout from 'components/layout/layout.component';
import React from 'react';
import Head from 'next/head';

const { Title, Paragraph, Text } = Typography;

const paddingSize = '200px';

const Hero = () => (
  <div className="wrapper" style={{ textAlign: 'center', paddingTop: '100px', paddingBottom: paddingSize }}>
    <Row>
      <Col span={12} offset={6}>
        <Title>Grow your gaming community with memberships and onboarding</Title>
        <Space direction="vertical" size="large">
          <Text>We help you make new friends and play together</Text>
          <Space size="large">
            <Button type="primary" size="large" shape="round" icon={<ArrowRightOutlined />}>Get Started</Button>
            <Button size="large" shape="round">Learn More</Button>
          </Space>
        </Space>
      </Col>
    </Row>
  </div>
);

const Features = () => (
  <Card bordered={false} bodyStyle={{ padding: '0' }}>
    <div className="wrapper" style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}>
      <Row>
        <Col span={12}>
          <Title>
            Save time recruiting and onboarding new members.
            <br/>
            We've got you covered!
          </Title>
          <Paragraph>We give you your own hosted website so you can show off your benefits and membership options</Paragraph>
          <Button shape="round">Find out more</Button>
        </Col>
      </Row>
    </div>
  </Card>
);

const OwnerFeatures = () => (
  <div className="wrapper" style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}>
    <Row>
      <Col span={12}>
        <Title>
          Features for Community Owners
        </Title>
        <Paragraph>
          <ul>
            <li>Create subscription based membership to your community</li>
            <li>Manage club benefits in one place.</li>
            <li>Focus on special events instead of management.</li>
            <li>Automate on-boarding and off-boarding of players.</li>
            <li>Build camaraderie between members.</li>
            <li>Level up prospects from recruits to long term community members</li>
            <li>Offer custom levels of membership (monthly, yearly, life time)</li>
          </ul>
        </Paragraph>
      </Col>
    </Row>
  </div>
);

const IntegratedBenefits = () => (
  <div className="wrapper" style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}>
    <Row>
      <Col span={12} push={12} style={{ textAlign: 'right' }}>
        <Title>
          Integrated Benefits System
        </Title>
        <Paragraph>
          We've integrated with third parties like Discord, Steam and Twitch to handle things like special permissions, membership levels and VIP access to game servers automatically.
        </Paragraph>
        <Paragraph>
          We even send your members something special from you on their birthday!
        </Paragraph>
        <Button shape="round">Find out more</Button>
      </Col>
    </Row>
  </div>
);

const Home = () => (
  <BrochureLayout>
    <Head>
      <title>300</title>
    </Head>
    <Hero />
    <Features />
    <IntegratedBenefits />
    <OwnerFeatures />
  </BrochureLayout>
);

export default Home;

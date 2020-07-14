import {
  ArrowRightOutlined,
  IdcardOutlined,
  MoneyCollectOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tabs, Typography } from 'antd';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const paddingSize = '200px';
const paddingHalfSize = '60px';

const variants = {
  start: {
    opacity: 0,
    y: 10,
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      type: 'spring',
      damping: 10,
      stiffness: 100,
    },
  }),
};

const A = ({ children, delay = 0 }) => (
  <motion.div
    custom={delay}
    initial="start"
    animate="visible"
    variants={variants}
  >
    {children}
  </motion.div>
);

const Hero: React.FC = () => {
  const router = useRouter();
  return (
    <div
      className="wrapper"
      style={{
        textAlign: 'center',
        paddingTop: '100px',
        paddingBottom: paddingSize,
      }}
    >
      <Row align="middle" justify="center">
        <Col md={{ span: 24 }} lg={{ span: 12 }}>
          <A>
            <Title>Working Title</Title>
          </A>
          <Space direction="vertical" size="large">
            <A delay={1}>
              <Text>
                Grow your online community with memberships and onboarding
              </Text>
            </A>
            <Space size="large">
              <A delay={2}>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => router.push('/communities')}
                  icon={<ArrowRightOutlined />}
                >
                  Get Started
                </Button>
              </A>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

const Features: React.FC = () => (
  <Card bordered={false} bodyStyle={{ padding: '0' }}>
    <div
      className="wrapper"
      style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}
    >
      <Row justify="start">
        <Col md={{ span: 24 }} lg={{ span: 12 }}>
          <Title>
            Save time recruiting and onboarding new members.
            <br />
            We&rsquo;ve got you covered!
          </Title>
          <Paragraph>
            We give you your own hosted website so you can show off your
            benefits and membership options
          </Paragraph>
          <Button shape="round">Find out more</Button>
        </Col>
      </Row>
    </div>
  </Card>
);

const IntegratedBenefits: React.FC = () => (
  <div
    className="wrapper"
    style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}
  >
    <Row justify="end">
      <Col md={{ span: 24 }} lg={{ span: 12 }}>
        <Title>Integrated Benefits System</Title>
        <Paragraph>
          We&rsquo;ve integrated with third parties like Discord, Steam and
          Twitch to handle things like special permissions, membership levels
          and VIP access to game servers automatically.
        </Paragraph>
        <Paragraph>
          We even send your members something special from you on their
          birthday!
        </Paragraph>
        <Button shape="round">Find out more</Button>
      </Col>
    </Row>
  </div>
);

const FeatureCell: React.FC<{
  title: string;
  icon: any;
  text: React.ReactChild;
  delay?: number;
}> = ({ title, icon, text, delay = 0 }) => {
  const Icon = icon;

  return (
    <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
      <A delay={delay}>
        <Title level={2}>
          <Space size="middle">
            <Icon
              style={{
                background: 'var(--primary-color)',
                borderRadius: '50%',
                padding: '0.4em',
                color: 'black',
              }}
            />
            <span>{title}</span>
          </Space>
        </Title>
        <Paragraph>{text}</Paragraph>
      </A>
    </Col>
  );
};

const features = {
  player: [
    {
      icon: SafetyCertificateOutlined,
      title: 'Active Communities',
      text:
        'We vet all communities listed in our network to ensure they play regularly and support the development of players.',
    },
    {
      icon: TeamOutlined,
      title: 'Player Matching',
      text:
        'When you join a community you are also matched with 10 other players who often live in the same city, speak the same language and play on the same schedule.',
    },
    {
      icon: RocketOutlined,
      title: 'Instant VIP Status',
      text:
        'We integrate with Discord, Steam and game servers to get you on the whitelist instantly, so you&rsquo;re ready for battle.',
    },
  ],
  owner: [
    {
      text:
        'Take membership subscription for your community, you control the amount, how often and what rewards and benefits to offer.',
      title: 'Subscriptions',
      icon: MoneyCollectOutlined,
    },
    {
      text:
        'We manage on-boarding and off-boarding of players for you, track member engagement and give you access to detailed reports each week.',
      title: 'Automation',
      icon: ThunderboltOutlined,
    },
    {
      title: 'Team Structure',
      text:
        'We have perfected the organisational structure for a community to scale. Promote your members between roles and delegate responsibilities to your leaders',
      icon: TeamOutlined,
    },
    {
      title: 'Verify Connections',
      text:
        'We collate all your members followers statistics to help you understand your communities reach. For public profiles we track Twitch and YouTube social counts.',
      icon: IdcardOutlined,
    },
    {
      text:
        'Connect with other communities in our network. Compete in community matches and record results in our official ladder.',
      title: 'Join Events',
      icon: TrophyOutlined,
    },
    {
      text:
        'Some text is used just to fill up space, kinda like this one. Its only a problem once someone reads it. So stop reading this message and go away.',
      title: 'Level up',
      icon: SmileOutlined,
    },
  ],
};

const FeatureTabs: React.FC = () => (
  <div className="wrapper" style={{ paddingBottom: paddingSize }}>
    <Tabs defaultActiveKey="1" size="large">
      <TabPane tab={<span>For Players</span>} key="1">
        <Row
          justify="space-around"
          gutter={[80, 45]}
          style={{ marginTop: paddingHalfSize }}
        >
          {features.player.map((props, index) => (
            <FeatureCell delay={index} key={props.title} {...props} />
          ))}
        </Row>
      </TabPane>
      <TabPane tab={<span>For Community Managers</span>} key="2">
        <Row
          justify="space-around"
          gutter={[80, 45]}
          style={{ marginTop: paddingHalfSize }}
        >
          {features.owner.map((props, index) => (
            <FeatureCell delay={index} key={props.title} {...props} />
          ))}
        </Row>
      </TabPane>
    </Tabs>
  </div>
);

const Home: React.FC = () => (
  <>
    <Head>
      <title>300</title>
    </Head>
    <Hero />
    <FeatureTabs />
    <Features />
    <IntegratedBenefits />
  </>
);

export default Home;

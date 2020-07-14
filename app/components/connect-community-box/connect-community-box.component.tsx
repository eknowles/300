import { Button, Col, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const ConnectCommunityBox: React.FC = () => {
  const router = useRouter();

  return (
    <Row>
      <Col span={12}>
        <div style={{ margin: '5em 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
          >
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
            <Button type="primary" onClick={() => router.push('/join')}>
              Invite Discord Bot
            </Button>
          </motion.div>
        </div>
      </Col>
    </Row>
  );
};

export default ConnectCommunityBox;

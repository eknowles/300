import { Button, Card, List, Space, Typography, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const SubscriptionPlanColumn = ({
  name,
  currency = '£',
  integer,
  fraction,
  description,
  header,
  benefits = [],
  interval,
  ctaText = 'Join Now',
  special = false,
}) => {
  const router = useRouter();
  const [isJoining, setJoining] = useState(false);
  const { communityId } = router.query;

  const onJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      });
      await res.json();
      message.success(`Success! You have joined a community`);
      await router.push(`/dashboard`);
    } catch (e) {
      message.error(e.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card
      hoverable
      bodyStyle={{ outline: special ? '1px solid var(--primary-color)' : '' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>{name}</Title>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: '30%',
              transform: 'translateY(-1.7em)',
              display: 'inline-block',
              fontWeight: 300,
            }}
          >
            {currency}
          </span>
          <span style={{ color: 'white' }}>{integer}</span>
          <span
            style={{
              fontSize: '30%',
              fontWeight: 300,
              transform: 'translateY(-1.7em)',
              display: 'inline-block',
            }}
          >
            {fraction}
          </span>
          <span
            style={{
              fontSize: '20%',
              fontWeight: 400,
              transform: 'translateX(-2em)',
              display: 'inline-block',
            }}
          >
            /{interval}
          </span>
        </div>
        <Text>{description}</Text>
        <Button
          loading={isJoining}
          onClick={onJoin}
          block
          type={special ? 'primary' : 'default'}
          size="large"
        >
          {ctaText}
        </Button>
        <List
          header={
            header && (
              <Text strong style={{ color: 'white' }}>
                {header}:
              </Text>
            )
          }
        >
          {benefits.map((benefit, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <List.Item key={index}>
              <Text>{benefit}</Text>
            </List.Item>
          ))}
        </List>
      </Space>
    </Card>
  );
};

export default SubscriptionPlanColumn;

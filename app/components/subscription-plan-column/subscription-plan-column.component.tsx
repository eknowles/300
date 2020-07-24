import { Button, Card, List, Space, Typography, message } from 'antd';
import { UserContext } from 'app/contexts/user.context';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';

const { Title, Text } = Typography;

export interface ISubscriptionPlanProps {
  id: string;
  name: string;
  currency: string;
  decimal: string;
  integer: string;
  fraction: string;
  description: string;
  header: string;
  benefits: string[];
  interval: string;
  ctaText: string;
  special?: boolean;
}

const SubscriptionPlanColumn: React.FC<ISubscriptionPlanProps> = ({
  id,
  name,
  currency = '£',
  decimal = '.',
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
  const { user } = useContext(UserContext);

  // eslint-disable-next-line consistent-return
  const onJoin = async () => {
    if (!user) {
      return router.push(
        `/api/oauth2/discord/login?redirect=/communities/${communityId}`
      );
    }

    setJoining(true);

    const stripeCreateCheckoutSessionUrl = `/api/stripe/connect?action=checkout&priceId=${id}&communityProfileId=${communityId}`;

    try {
      const res = await fetch(stripeCreateCheckoutSessionUrl);
      const response = await res.json();

      if (res.status !== 200) {
        throw new Error(response.message);
      }

      const { id: checkoutSessionId, publishableKey } = response;

      const stripe = await loadStripe(publishableKey);

      stripe
        .redirectToCheckout({
          sessionId: checkoutSessionId,
        })
        .then((result) => {
          throw new Error(result.error.message);
        });
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
        <Title level={4} style={{ textTransform: 'uppercase' }}>
          {name}
        </Title>
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
            {decimal}
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
                {header}
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

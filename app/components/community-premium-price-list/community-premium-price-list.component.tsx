import { Col, Divider, Row, Typography } from 'antd';
import SubscriptionPlanColumn from 'app/components/subscription-plan-column';
import { IPremiumPrice } from 'app/helpers/types';
import React from 'react';
import useSWR from 'swr';
import { ISubscriptionPlanProps } from '../subscription-plan-column/subscription-plan-column.component';

const { Title, Paragraph } = Typography;

const intervalFormatter = (interval: string, count: number) => {
  if (count === 1) {
    return interval;
  }

  return `${count} ${interval}s`;
};

const cleanPrices = (
  prices: IPremiumPrice[] = []
): ISubscriptionPlanProps[] => {
  return prices
    .sort((a, b) => a.unitAmount - b.unitAmount)
    .map((price) => {
      const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: price.currency,
        currencyDisplay: 'narrowSymbol',
        useGrouping: false,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const parts = formatter.formatToParts(price.unitAmount / 100);

      return {
        id: price.id,
        name: price.name,
        currency: parts.find((part) => part.type === 'currency').value,
        integer: parts.find((part) => part.type === 'integer').value,
        decimal: parts.find((part) => part.type === 'decimal').value,
        fraction: parts.find((part) => part.type === 'fraction').value,
        description: '',
        header: price.metadata.header || '',
        benefits: (price.metadata.benefits || '').split(','),
        interval: `every ${intervalFormatter(
          price.interval,
          price.intervalCount
        )}`,
        ctaText: 'Subscribe',
        special: !!price.metadata.isSpecial,
      };
    });
};

const CommunityPremiumPriceList: React.FC<{ id: string }> = ({ id }) => {
  const { data, error } = useSWR<IPremiumPrice[]>(
    `/api/stripe/connect?action=prices&communityProfileId=${id}`,
    async (url) => (await fetch(url)).json(),
    {
      revalidateOnFocus: false,
    }
  );

  if (!data || error) {
    return null;
  }

  if (!data.length) {
    return null;
  }

  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Title level={3}>Premium Membership</Title>
        <Paragraph>
          If you would like to help us pay for servers you can become a premium
          member. We offer private squad training so you are up to scratch with
          our tactical war plans and leadership lingo. Take part in massive 50
          vs 50 community matches, and jump the queue when joining our servers
          with a VIP server slot with your name on it.
        </Paragraph>
      </Col>
      {cleanPrices(data || []).map((plan) => (
        <Col key={plan.name} sm={{ span: 12 }} md={{ span: 8 }} span={24}>
          <SubscriptionPlanColumn {...plan} />
        </Col>
      ))}
    </Row>
  );
};

export default CommunityPremiumPriceList;

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Row, Space, Statistic } from 'antd';
import { IPremiumPrice } from 'app/helpers/types';
import React from 'react';
import useSWR from 'swr';

const NumberStat: React.FC<any> = ({
  amount = 0,
  currency = 'gbp',
  title,
  prefix = '',
  suffix = '',
}) => {
  const formatter = Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  });

  return (
    <Statistic
      title={title}
      value={formatter.format(amount / 100)}
      prefix={prefix}
      suffix={suffix}
    />
  );
};

const CommunityAdminDashboard = ({ communityId }) => {
  const { data } = useSWR<IPremiumPrice[]>(
    `/api/stripe/connect?action=accountBalance&communityProfileId=${communityId}`,
    async (url) => (await fetch(url)).json(),
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div>
      <Row gutter={48}>
        <Col>
          <Statistic
            title="Total Members"
            value={data?.totalMembers || 0}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col>
          <Statistic
            title="Premium Members"
            value={3}
            prefix={<SafetyOutlined />}
          />
        </Col>
        <Col>
          <NumberStat
            title="Balance Pending"
            suffix={<ClockCircleOutlined />}
            amount={data?.balancePending.amount}
            currency={data?.balancePending.currency}
          />
        </Col>
        <Col>
          <NumberStat
            title="Balance Available"
            suffix={<CheckCircleOutlined />}
            amount={data?.balanceAvailable.amount}
            currency={data?.balanceAvailable.currency}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <a
            href={`/api/stripe/connect?action=login&communityProfileId=${communityId}`}
          >
            <Space>
              <DollarOutlined />
              <span>View payouts</span>
            </Space>
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default CommunityAdminDashboard;

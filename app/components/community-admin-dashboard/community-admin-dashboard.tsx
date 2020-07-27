import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Row, Space, Statistic } from 'antd';
import React from 'react';
import useSWR from 'swr';
import { IGetAccountBalanceResult } from 'app/functions/stripe/get-account-balance';

const formatter = (currency = 'gbp', value = 0) =>
  Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(value);

const CommunityAdminDashboard = ({ communityId }) => {
  const { data } = useSWR<IGetAccountBalanceResult>(
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
            value={data?.totalPremium || 0}
            prefix={<SafetyOutlined />}
          />
        </Col>
        <Col>
          <Statistic
            title="Balance Pending"
            value={formatter(
              data?.balancePending.currency,
              data?.balancePending.amount / 100
            )}
            suffix={<ClockCircleOutlined />}
          />
        </Col>
        <Col>
          <Statistic
            title="Balance Available"
            value={formatter(
              data?.balanceAvailable.currency,
              data?.balanceAvailable.amount / 100
            )}
            suffix={<CheckCircleOutlined />}
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

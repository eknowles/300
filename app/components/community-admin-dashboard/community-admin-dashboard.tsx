import { useRouter } from 'next/router';
import React from 'react';
import { Button, Card, Col, Row, Statistic, Space } from 'antd';

const CommunityAdminDashboard = ({ communityId }) => {
  const router = useRouter();

  return (
    <Card>
      <Row gutter={20} align="middle" justify="space-between">
        <Col>
          <Space size={20}>
            <Statistic title="Total Members" value={2} />
            <Statistic title="Total Members" value={2} />
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            block
            onClick={() =>
              router.push(
                `/api/stripe/connect?action=login&communityProfileId=${communityId}`
              )
            }
          >
            View payouts
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CommunityAdminDashboard;

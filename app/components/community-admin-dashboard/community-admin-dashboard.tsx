import { useRouter } from 'next/router';
import React from 'react';
import { Button, Space } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const CommunityAdminDashboard = ({ communityId }) => {
  const router = useRouter();

  return (
    <Space>
      <Button
        type="primary"
        size="large"
        block
        icon={<DollarOutlined />}
        onClick={() =>
          router.push(
            `/api/stripe/connect?action=login&communityProfileId=${communityId}`
          )
        }
      >
        View payouts
      </Button>
    </Space>
  );
};

export default CommunityAdminDashboard;

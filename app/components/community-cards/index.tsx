import { Avatar, Card } from 'antd';
import Link from 'next/link';
import React from 'react';

import './community-card.less';

export const CommunityCard: React.FC<any> = ({ id, name, avatarUrl }) => (
  <Link href="/communities/[communityId]" as={`/communities/${id}`}>
    <Card hoverable>
      <Card.Meta
        title={name}
        description={id}
        avatar={<Avatar src={avatarUrl} shape="square" size={56} />}
      />
    </Card>
  </Link>
);

export default CommunityCard;

import { Avatar, Card } from 'antd';
import Link from 'next/link';
import React from 'react';

export const CommunityCard: React.FC<any> = ({ id, name, avatarUrl }) => (
  <Link href="/communities/[communityId]" as={`/communities/${id}`}>
    <a>
      <Card hoverable>
        <Card.Meta
          title={name}
          description={id}
          avatar={<Avatar src={avatarUrl} shape="square" size={56} />}
        />
      </Card>
    </a>
  </Link>
);

export default CommunityCard;

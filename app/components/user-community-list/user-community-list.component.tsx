import { useQuery } from '@apollo/client';
import { Avatar, List, message } from 'antd';
import formatDate from 'app/helpers/date';
import Link from 'next/link';
import React from 'react';
import MEMBERSHIPS_LIST from './membership-list.query';

const UserCommunityList: React.FC<{ userProfileId: string }> = ({
  userProfileId,
}) => {
  const { loading, data, error } = useQuery(MEMBERSHIPS_LIST, {
    variables: {
      userProfileId,
    },
    displayName: 'communityProfiles',
  });

  if (error) {
    message.error(error && error.message);
  }

  const items = data ? (data.profile.memberships?.data as any[]) : [];

  return (
    <List
      header="My Memberships"
      bordered
      itemLayout="horizontal"
      dataSource={items}
      loading={loading}
      renderItem={({ createdAt, role, communityProfile }) => (
        <List.Item
          extra={<div>Joined {formatDate(createdAt)}</div>}
          actions={[
            <Link
              key="view"
              href="/communities/[communityId]"
              as={`/communities/${communityProfile._id}`}
            >
              <a>View</a>
            </Link>,
            role === 'OWNER' && (
              <Link
                key="view"
                href="/communities/[communityId]/admin"
                as={`/communities/${communityProfile._id}/admin`}
              >
                <a>Admin</a>
              </Link>
            ),
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar size="large" src={communityProfile.iconUrl} />}
            title={
              <Link
                href="/communities/[communityId]"
                as={`/communities/${communityProfile._id}`}
              >
                <a>{communityProfile.name}</a>
              </Link>
            }
            description={role}
          />
        </List.Item>
      )}
    />
  );
};

export default UserCommunityList;

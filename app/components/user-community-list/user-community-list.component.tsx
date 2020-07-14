import { useQuery } from '@apollo/react-hooks';
import { Avatar, List } from 'antd';
import formatDate from 'app/helpers/date';
import gql from 'graphql-tag';
import Link from 'next/link';
import React from 'react';

const MY_COMMUNITY_LIST = gql`
  query MyCommunityList {
    profile: myProfile {
      memberships {
        data {
          role
          createdAt
          communityProfile {
            _id
            name
            iconUrl
          }
        }
      }
    }
  }
`;

const UserCommunityList = () => {
  const { loading, data } = useQuery(MY_COMMUNITY_LIST);

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

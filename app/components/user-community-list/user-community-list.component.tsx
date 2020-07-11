import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import React from 'react';
import { List, Avatar } from 'antd';

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

const UserCommunityList = ({ userId }) => {
  const { loading, data } = useQuery(MY_COMMUNITY_LIST);

  const items = data ? (data.profile.memberships?.data as any[]) : [];

  // todo set locale to be based on the users localeCode
  const formatter = new Intl.DateTimeFormat('en-GB');

  return (
    <List
      header="Community Memberships"
      itemLayout="horizontal"
      dataSource={items}
      loading={loading}
      renderItem={({ createdAt, role, communityProfile }) => (
        <List.Item
          extra={<div>Since {formatter.format(new Date(createdAt))}</div>}
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

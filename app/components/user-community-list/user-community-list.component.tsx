import Link from 'next/link';
import React from 'react';
import { List, Avatar } from 'antd';
import { request } from 'graphql-request';
import useSWR from 'swr';

const useDashboardData = (profileId) => {
  const { data, error } = useSWR(profileId, (id) =>
    request(
      '/api/graphql',
      `query ViewProfile($id: ID!) {
       profile: findUserProfileByID(id: $id) {
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
     }`,
      { id }
    )
  );
  return { data, error };
};

const UserCommunityList = ({ userId }) => {
  const { data } = useDashboardData(userId);

  const items = data ? (data.profile.memberships?.data as any[]) : [];

  // todo set locale to be based on the users localeCode
  const formatter = new Intl.DateTimeFormat('en-GB');

  return (
    <List
      header="Community Memberships"
      itemLayout="horizontal"
      dataSource={items}
      loading={!data}
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

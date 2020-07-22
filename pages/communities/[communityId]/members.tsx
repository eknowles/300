import { gql, useQuery } from '@apollo/client';
import { Result, Space, Spin, Table, Typography, Avatar } from 'antd';
import CommunityHero from 'app/components/community-hero';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { SafetyOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CommunityMembersPage: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;

  const { loading, data, error } = useQuery(
    gql`
      query CommunityMemberListPageQuery($communityId: ID!) {
        community: findCommunityProfileByID(id: $communityId) {
          _id
          name
          iconUrl
          bannerUrl
          aboutText
          memberships {
            data {
              _id
              role
              createdAt
              isPremium
              isPending
              isActive
              userProfile {
                _id
                username
                avatarUrl
                localeCode
              }
            }
          }
        }
      }
    `,
    {
      variables: { communityId },
    }
  );

  if (error) {
    return <Result title={error && error.message} />;
  }

  if (!data) {
    return <Result icon={<Spin />} />;
  }

  const columns = [
    {
      title: 'User',
      dataIndex: 'userProfile',
      key: 'user',
      render: (userProfile) => (
        <Space>
          <Avatar src={userProfile.avatarUrl} />
          <Text>{userProfile.username}</Text>
        </Space>
      ),
    },
    {
      title: 'Premium',
      dataIndex: 'isPremium',
      key: 'isPremium',
      render: (isPremium) => (isPremium ? <SafetyOutlined /> : null),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <>
      <Head>
        <title>{data.community.name}</title>
      </Head>
      <CommunityHero
        iconUrl={data.community.iconUrl}
        bannerUrl={data.community.bannerUrl}
        title="Members"
        routes={[
          {
            path: '/',
            breadcrumbName: 'Home',
          },
          {
            path: '/communities',
            breadcrumbName: 'Communities',
          },
          {
            path: `/communities/[communityId]`,
            as: `/communities/${communityId}`,
            breadcrumbName: data.community.name,
          },
          {
            path: `/communities/[communityId]/members`,
            as: `/communities/${communityId}/members`,
            breadcrumbName: 'Members',
          },
        ]}
      />
      <div className="wrapper">
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={data.community.memberships.data}
        />
      </div>
    </>
  );
};

export default CommunityMembersPage;

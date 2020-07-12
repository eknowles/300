import { useQuery } from '@apollo/react-hooks';
import { Avatar, Button, Col, List, Row, Space, Typography } from 'antd';
import CommunityHero from 'app/components/community-hero';
import { getCommunityData, ICommunityModel, } from 'app/fauna/queries/community-page';
import formatDate from 'app/helpers/date';
import gql from 'graphql-tag';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const { Text } = Typography;

const CommunityActionButton = ({ communityId }) => {
  const router = useRouter();

  return (
    <Button
      type="primary"
      block
      onClick={() => router.push(`/communities/${communityId}/join`)}
    >
      Become a member
    </Button>
  );
};

export const getServerSideProps: GetServerSideProps<
  { data: ICommunityModel; communityId: string },
  { communityId: string }
> = async (context) => {
  const { communityId } = context.params;
  const { data } = await getCommunityData(communityId);

  return {
    props: {
      communityId,
      data,
    },
  };
};

const CommunityPage: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ data: communityData, communityId }) => {
  if (!communityId) {
    return null;
  }

  const { loading, data } = useQuery(
    gql`
      query CommunityProfileQuery($communityId: ID!) {
        community: findCommunityProfileByID(id: $communityId) {
          memberships {
            data {
              role
              createdAt
              userProfile {
                _id
                username
                avatarUrl
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

  return (
    <>
      <Head>
        <title>Community</title>
      </Head>
      <CommunityHero data={communityData} communityId={communityId} />
      <div className="wrapper">
        <Row>
          <Col span={19} />
          <Col span={5}>
            <List
              footer={<CommunityActionButton communityId={communityId} />}
              header="Members"
              itemLayout="horizontal"
              dataSource={(data?.community.memberships.data as any[]) || []}
              loading={loading}
              renderItem={(item) => (
                <List.Item style={{ lineHeight: '1.2' }}>
                  <Space>
                    <Avatar size={30} src={item.userProfile.avatarUrl} />
                    <Space direction="vertical" size={0}>
                      <Link
                        href="/users/[userProfileId]"
                        as={`/users/${item.userProfile._id}`}
                      >
                        <a style={{ fontSize: '15px', fontWeight: 'bold' }}>
                          {item.userProfile.username}
                        </a>
                      </Link>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CommunityPage;

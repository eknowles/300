import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import {
  getCommunityData,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import CommunityHero from 'app/components/community-hero';
import { Avatar, Card, List, Row, Col } from 'antd';

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

const formatDate = (date) => {
  const [, month, , year] = new Date(date).toDateString().split(' ');
  return `${month} ${year}`;
};

const CommunityPage: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ data: communityData, communityId }) => {
  if (!communityId) {
    return null;
  }

  const { loading, data, error } = useQuery(
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
              header="Members"
              itemLayout="horizontal"
              dataSource={(data?.community.memberships.data as any[]) || []}
              loading={loading}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="large" src={item.userProfile.avatarUrl} />
                    }
                    description={formatDate(item.createdAt)}
                    title={
                      <Link
                        href="/users/[userProfileId]"
                        as={`/users/${item.userProfile._id}`}
                      >
                        <a>{item.userProfile.username}</a>
                      </Link>
                    }
                  />
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

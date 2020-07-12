import { useQuery } from '@apollo/react-hooks';
import { Avatar, Col, List, Row, Space, Typography } from 'antd';
import CommunityHero from 'app/components/community-hero';
import SubscriptionPlanColumn from 'app/components/subscription-plan-column';
import {
  getCommunityData,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import formatDate from 'app/helpers/date';
import gql from 'graphql-tag';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const { Text, Title, Paragraph } = Typography;

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

  const plans = [
    {
      name: 'BASIC',
      description: 'For new players looking to join a community',
      integer: '0',
      fraction: '.00',
      header: 'Includes',
      benefits: ['Discord Role', 'Text & Voice Permissions'],
    },
    {
      special: true,
      name: '12 MONTH',
      description: 'For competitive and committed players',
      integer: '3',
      fraction: '.99',
      header: 'BASIC Plus',
      benefits: [
        'VIP Game Server Slots',
        'Play Competitive Matches',
        'Exclusive Training Sessions',
        'Access to swag',
      ],
    },
    {
      name: '6 MONTH',
      description: 'Our top tier for elite supporters and frequent players',
      integer: '9',
      fraction: '.99',
      header: 'TEAM Plus',
      benefits: [
        'Hard Enamel Badge',
        'Priority Games',
        'Monthly Lottery Ticket',
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Community</title>
      </Head>
      <CommunityHero data={communityData} communityId={communityId} />
      <div className="wrapper">
        <Row gutter={[32, 32]}>
          <Col lg={{ span: 19 }}>
            <Title level={3}>About Us</Title>
            <Paragraph>
              We focus on hardcore strategic gameplay, we aim to win, but most
              of we all enjoy playing as a team. Our community is very special,
              we are mostly all from the UK and speak English. As a community we
              also want to support all the players in the game by offering
              exciting games run on our servers.
            </Paragraph>
            <Title level={3}>Membership</Title>
            <Paragraph>
              If you would like to help us pay for servers you can subscribe to
              our TEAM or VIP plan to take part in massive 50 vs 50 community
              matches, and jump the queue when joining our servers.
            </Paragraph>
            <Row gutter={[32, 32]}>
              {plans.map((plan) => (
                <Col key={plan.name} md={{ span: 8 }} span={24}>
                  <SubscriptionPlanColumn {...plan} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={{ span: 5 }}>
            <List
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

import { useQuery } from '@apollo/react-hooks';
import { Col, Row, Typography } from 'antd';
import CommunityHero from 'app/components/community-hero';
import CommunityMemberList from 'app/components/community-member-list';
import SubscriptionPlanColumn from 'app/components/subscription-plan-column';
import {
  getCommunityData,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import gql from 'graphql-tag';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

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
      name: 'BRONZE',
      description: '',
      integer: '9',
      fraction: '.99',
      interval: 'every 3 months',
      header: 'Includes',
      benefits: [
        'Bronze Discord Role',
        'VIP Game Server Slot',
        'Play Competitive Matches',
        'Private Training Sessions',
      ],
    },
    {
      special: true,
      name: 'SILVER',
      description: '',
      integer: '19',
      fraction: '.98',
      interval: 'every 6 months',
      header: 'BRONZE Plus',
      benefits: ['Silver Discord Role', 'VIP Slot All Games'],
    },
    {
      name: 'GOLD',
      description: '',
      integer: '39',
      fraction: '.96',
      interval: 'every 12 months',
      header: 'SILVER Plus',
      benefits: ['Gold Discord Role', 'Undying Love and Respect'],
    },
  ];

  return (
    <>
      <Head>
        <title>Community</title>
      </Head>
      <CommunityHero data={communityData} communityId={communityId} />
      <motion.div
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        <Row gutter={[32, 32]}>
          <Col lg={{ span: 19 }}>
            <Title level={3}>About Us</Title>
            <Paragraph>
              We focus on hardcore strategic gameplay, we aim to win, but most
              of we all enjoy playing as a team. Our community is very special,
              we are mostly from the UK and speak English but we welcome anyone
              with open arms that likes to have a laugh and get stuck in. As a
              community we also want to support all the players in the game by
              offering exciting games run on our servers. Our dedicate team of
              admins are always at hand to make sure gameplay is fair and and
              friendly.
            </Paragraph>
            <Title level={3}>Premium Membership</Title>
            <Paragraph>
              If you would like to help us pay for servers you can become a
              premium member. We offer private squad training so you are up to
              scratch with our tactical war plans and leadership lingo. Take
              part in massive 50 vs 50 community matches, and jump the queue
              when joining our servers with a VIP server slot with your name on
              it.
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
            <CommunityMemberList
              items={(data?.community.memberships.data as any[]) || []}
              loading={loading}
            />
          </Col>
        </Row>
      </motion.div>
    </>
  );
};

export default CommunityPage;

import { Avatar, Checkbox, Col, Row, Skeleton, Space, Typography } from 'antd';
import SubscriptionPlanColumn from 'app/components/subscription-plan-column';
import { request } from 'graphql-request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

const { Title, Text, Paragraph } = Typography;

const useCommunityData = (communityId) => {
  const { data, error } = useSWR(communityId, (id) =>
    request(
      '/api/graphql',
      `query JoinCommunity($id: ID!) {
       community: findCommunityProfileByID(id: $id) {
         name
         iconUrl
       }
     }`,
      { id }
    )
  );
  return { data, error };
};

const JoinCommunity: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;
  const { data } = useCommunityData(communityId);

  return (
    <>
      <Head>
        <title>Manage Community Membership</title>
      </Head>
      <div className="wrapper" style={{ textAlign: 'center' }}>
        <Space direction="vertical" size="large">
          {data
            ? [
                <Avatar key="avatar" src={data.community.iconUrl} size={64} />,
                <Title key="title" style={{ margin: 0 }}>
                  {data.community.name}
                </Title>,
              ]
            : [
                <Skeleton.Avatar key="avatar" active={false} size={64} />,
                <Skeleton.Input
                  key="title"
                  style={{ width: '200px' }}
                  active
                  size="large"
                />,
              ]}
          <Row justify="center">
            <Col span={24} md={{ span: 12 }}>
              <Paragraph>
                We focus on hardcore strategic gameplay, we aim to win, but most
                of we all enjoy playing as a team. Our community is very
                special, we are mostly all from the UK and speak English. As a
                community we also want to support all the players in the game by
                offering exciting games run on our servers. If you would like to
                help us pay for servers you can subscribe to our TEAM or VIP
                plan to take part in massive 50 vs 50 community matches, and
                jump the queue when joining our servers.
              </Paragraph>
            </Col>
          </Row>
          <Text>
            <Checkbox onChange={() => 1}>
              I agree to abide by the <a>Community rules</a>
            </Checkbox>
          </Text>
        </Space>
      </div>
      <div className="wrapper">
        <Row justify="center" gutter={[32, 32]} style={{ margin: '6em 0' }}>
          <Col md={{ span: 8 }} lg={{ span: 6 }} span={24}>
            <SubscriptionPlanColumn
              name="BASIC"
              description="For new players looking to join a community"
              integer="0"
              fraction=".00"
              header="Includes"
              benefits={['Discord Role', 'Text & Voice Permissions']}
            />
          </Col>
          <Col md={{ span: 8 }} lg={{ span: 6 }} span={24}>
            <SubscriptionPlanColumn
              name="TEAM"
              description="For competitive and committed players"
              integer="3"
              fraction=".99"
              header="BASIC Plus"
              benefits={[
                'VIP Game Server Slots',
                'Play Competitive Matches',
                'Exclusive Training Sessions',
                'Access to swag',
              ]}
              special
            />
          </Col>
          <Col md={{ span: 8 }} lg={{ span: 6 }} span={24}>
            <SubscriptionPlanColumn
              name="VIP"
              description="Our top tier for elite supporters and frequent players"
              integer="9"
              fraction=".99"
              header="TEAM Plus"
              benefits={[
                'Hard Enamel Badge',
                'Priority Games',
                'Monthly Lottery Ticket',
              ]}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JoinCommunity;

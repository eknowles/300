import { gql, useQuery } from '@apollo/client';
import { Col, Result, Row, Spin, Typography } from 'antd';
import CommunityHero from 'app/components/community-hero';
import CommunityMemberList from 'app/components/community-member-list';
import CommunityPremiumPriceList from 'app/components/community-premium-price-list';
import EditableCommunityAbout from 'app/components/editable-community-about';
import JoinCommunityFree from 'app/components/join-community-free';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const { Title } = Typography;

// export const getServerSideProps: GetServerSideProps<
//   { data: ICommunityModel; communityId: string },
//   { communityId: string }
// > = async (context) => {
//   const { communityId } = context.params;
//   const { data } = await getCommunityData(communityId);
//
//   return {
//     props: {
//       communityId,
//       data,
//     },
//   };
// };

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;

  const { loading, data, error } = useQuery(
    gql`
      query CommunityProfileQuery($communityId: ID!) {
        community: findCommunityProfileByID(id: $communityId) {
          _id
          name
          iconUrl
          bannerUrl
          aboutText
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

  if (error) {
    return <Result title={error && error.message} />;
  }

  if (!data) {
    return <Result icon={<Spin />} />;
  }

  return (
    <>
      <Head>
        <title>{data.community.name}</title>
      </Head>
      <CommunityHero
        isLarge
        iconUrl={data.community.iconUrl}
        bannerUrl={data.community.bannerUrl}
        title={data.community.name}
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
        ]}
      />
      <motion.div
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        <Row gutter={[32, 32]}>
          <Col lg={{ span: 19 }} span={24}>
            <Title level={3}>About Us</Title>
            {communityId && <EditableCommunityAbout id={communityId} />}
            <CommunityPremiumPriceList id={data.community._id} />
          </Col>
          <Col lg={{ span: 5 }} span={24}>
            <CommunityMemberList
              header={
                <Link
                  href="/communities/[communityId]/members"
                  as={`/communities/${communityId}/members`}
                >
                  <a>Members</a>
                </Link>
              }
              items={(data?.community.memberships.data as any[]) || []}
              loading={loading}
            />
            <JoinCommunityFree id={communityId} />
          </Col>
        </Row>
      </motion.div>
    </>
  );
};

export default CommunityPage;

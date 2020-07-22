import { gql, useQuery } from '@apollo/client';
import { Col, Result, Row, Spin, Typography } from 'antd';
import CommunityHero from 'app/components/community-hero';
import CommunityMemberList from 'app/components/community-member-list';
import CommunityPremiumPriceList from 'app/components/community-premium-price-list';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const { Title, Paragraph } = Typography;

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
        <title>Community</title>
      </Head>
      <CommunityHero data={data.community} communityId={data.community._id} />
      <motion.div
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        <Row gutter={[32, 32]}>
          <Col lg={{ span: 19 }}>
            {data.community.aboutText && (
              <>
                <Title level={3}>About Us</Title>
                <Paragraph>{data.community.aboutText}</Paragraph>
              </>
            )}
            <CommunityPremiumPriceList id={data.community._id} />
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

import { UserContext } from 'app/contexts/user.context';
import {
  getCommunities,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Head from 'next/head';
import { PageHeader, Typography, Button, Col, Row } from 'antd';
import { CommunityCard } from 'app/components/community-cards';

const { Title, Paragraph } = Typography;

export const getServerSideProps: GetServerSideProps<{
  communities: Array<ICommunityModel & { id: string }>;
}> = async () => {
  const { data: communities } = await getCommunities();

  return {
    props: {
      communities,
    },
  };
};

const ActiveCommunities: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ communities = [] }) => {
  return (
    <>
      <Head>
        <title>Communities</title>
      </Head>
      <div className="wrapper">
        <Title level={1} style={{ marginTop: 30 }}>
          Discover
        </Title>
        <PageHeader title="Featured" />
        <Row gutter={[24, 24]}>
          {communities.map((com) => (
            <Col key={com.id} span={6}>
              <CommunityCard
                id={com.id}
                avatarUrl={com.iconUrl}
                imageUrl={com.splashUrl}
                name={com.name}
                language={com.countryCode}
              />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ActiveCommunities;

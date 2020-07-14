import { PageHeader, Typography } from 'antd';
import { CommunityCard } from 'app/components/community-cards';
import {
  getCommunities,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  visible: {
    transition: {
      delay: 0,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const { Title } = Typography;

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
        <motion.div variants={container} initial="hidden" animate="visible">
          {communities.map((com) => (
            <motion.span
              key={com.id}
              variants={item}
              style={{
                display: 'inline-block',
                width: '300px',
                marginRight: '20px',
                marginBottom: '20px',
              }}
            >
              <CommunityCard
                id={com.id}
                avatarUrl={com.iconUrl}
                imageUrl={com.splashUrl}
                name={com.name}
                language={com.countryCode}
              />
            </motion.span>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default ActiveCommunities;

import { UserContext } from 'app/contexts/user.context';
import {
  getCommunities,
  ICommunityModel,
} from 'app/fauna/queries/community-page';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Head from 'next/head';
import { PageHeader, Typography, Button } from 'antd';
import { CommunityCard } from 'app/components/community-cards';

const { Title, Paragraph } = Typography;

export const getServerSideProps: GetServerSideProps<{
  communities: Array<ICommunityModel & { id: string }>;
}> = async () => {
  const { data: communities } = await getCommunities();

  return {
    props: {
      communities: communities.map((community) => ({
        ...community.data,
        id: community.ref.id,
      })),
    },
  };
};

const ActiveCommunities: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ communities }) => {
  const { user, fetched } = useContext(UserContext);
  const router = useRouter();

  const clickedConnect = () => {
    return fetched && user
      ? router.push('/communities/new')
      : router.push('/api/oauth2/discord');
  };

  return (
    <>
      <Head>
        <title>Communities</title>
      </Head>
      <div className="wrapper">
        <Title level={1}>Communities</Title>
        <PageHeader title="Featured Communities" />
        {communities.map((com) => (
          <CommunityCard
            id={com.id}
            key={com.id}
            avatarUrl={com.iconUrl}
            name={com.name}
            language={com.countryCode}
          />
        ))}
      </div>
      <div className="wrapper">
        <div style={{ margin: '10vh 0' }}>
          <Title level={2}>Connect your Community to 300</Title>
          <Paragraph>
            Join the 300 network today and promote your community. We offer a
            platform to help you manage your organisation and grow your
            membership with automated benefits and features. Monetise your
            membership with subscriptions to support your growth and pay for
            services like game servers and hosting.
          </Paragraph>
          <Paragraph>
            It is FREE to create your community! Our mission is to help small
            and medium sized communities grow their membership. Join us today
            and grow your community.
          </Paragraph>
          <Button onClick={clickedConnect}>Connect your Community</Button>
        </div>
      </div>
    </>
  );
};

export default ActiveCommunities;

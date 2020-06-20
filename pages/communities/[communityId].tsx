import React from 'react';
import Head from 'next/head';
import { PageHeader, Tag } from 'antd';
import Link from 'next/link';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import {
  getCommunityData,
  ICommunityModel,
} from 'app/fauna/queries/community-page';

const itemRender = (route, params, routes) => {
  const last = routes.indexOf(route) === routes.length - 1;

  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={route.path}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{route.breadcrumbName}</a>
    </Link>
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
>> = ({ data, communityId }) => {
  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home',
    },
    {
      path: '/communities',
      breadcrumbName: 'Communities',
    },
    {
      path: `/communities/${communityId}`,
      breadcrumbName: data.name,
    },
  ];

  return (
    <>
      <Head>
        <title>Community</title>
      </Head>
      <div className="wrapper">
        <PageHeader
          title={data.name}
          subTitle={data.localeCode}
          avatar={{ src: data.iconUrl }}
          tags={<Tag>{data.tag}</Tag>}
          breadcrumb={{ routes, itemRender }}
        />
      </div>
    </>
  );
};

export default CommunityPage;

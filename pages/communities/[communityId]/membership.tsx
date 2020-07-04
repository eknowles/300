import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import { PageHeader } from 'antd';
import Link from 'next/link';
import useSWR from 'swr';
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

const useRole = (communityId: any) => {
  return useSWR<{
    authenticated: boolean;
    role: null | string;
  }>(
    `/api/communities/${communityId}/role`,
    (url) => fetch(url).then((r) => r.json()),
    {
      initialData: { authenticated: false, role: null },
      revalidateOnMount: true,
    }
  );
};

const ManageMembership: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ data, communityId }) => {
  const router = useRouter();
  const { data: roleData } = useRole(communityId);

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
    {
      path: `/communities/${communityId}/membership`,
      breadcrumbName: 'Membership',
    },
  ];

  return (
    <>
      <Head>
        <title>Manage Community Membership</title>
      </Head>
      <div className="wrapper">
        <PageHeader
          title="Manage Membership"
          onBack={() => router.push(`/communities/${communityId}`)}
          breadcrumb={{ routes, itemRender }}
        />
        TODO
      </div>
    </>
  );
};

export default ManageMembership;

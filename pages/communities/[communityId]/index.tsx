import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import { PageHeader, Button } from 'antd';
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

const CommunityActionButton = ({ communityId, authenticated, role }) => {
  const router = useRouter();

  if (!authenticated) {
    return null;
  }

  return (
    authenticated && (
      <Button
        type={role ? 'default' : 'primary'}
        onClick={() =>
          router.push(
            `/communities/${communityId}/${role ? 'membership' : 'join'}`
          )
        }
      >
        {role ? 'Manage my membership' : 'Become a member'}
      </Button>
    )
  );
};

const CommunityPage: React.FC<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = ({ data, communityId }) => {
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
          extra={[
            <CommunityActionButton
              key="CommunityActionButton"
              {...roleData}
              communityId={communityId}
            />,
          ]}
          breadcrumb={{ routes, itemRender }}
        />
        TODO
      </div>
    </>
  );
};

export default CommunityPage;

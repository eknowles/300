import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import { PageHeader } from 'antd';
import Link from 'next/link';
import useSWR from 'swr';

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

const useRole = (communityId: any) => {
  return useSWR<{
    authenticated: boolean;
    role: null | string;
  }>(
    [`/api/communities/${communityId}/role`, communityId],
    (url, id) => id && fetch(url).then((r) => r.json()),
    {
      initialData: { authenticated: false, role: null },
      revalidateOnMount: true,
    }
  );
};

const ManageMembership: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;
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
      breadcrumbName: `${communityId}`,
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
        <div>TODO MANAGE MEMBERSHIP</div>
        <div>{JSON.stringify(roleData)}</div>
      </div>
    </>
  );
};

export default ManageMembership;

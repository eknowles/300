import { useQuery, gql } from '@apollo/client';
import { PageHeader, Result, Spin } from 'antd';
import CommunityAdminDashboard from 'app/components/community-admin-dashboard';
import CommunitySetup from 'app/components/community-setup';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

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

const GET_COMMUNITY_INFO = gql`
  query CommunityAdminInfo($communityId: ID!) {
    community: findCommunityProfileByID(id: $communityId) {
      name
      iconUrl
      countryCode
      communityAccount {
        stripeAccountId
        ownerAccount {
          email
        }
      }
    }
  }
`;

const CommunityAdmin: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;

  if (!communityId) {
    return null;
  }

  const { loading, data } = useQuery(GET_COMMUNITY_INFO, {
    variables: { communityId },
  });

  if (loading || !data) return <Result icon={<Spin />} />;

  if (!data.community) {
    return <Result title="No Community Data" />;
  }

  // 1. get community profile
  // 2. check if profile has been confirmed (name, games, tag, url)
  const { community } = data;
  const {
    communityAccount: { stripeAccountId },
  } = community;

  // 3. check stripe user id

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
      breadcrumbName: community.name,
    },
    {
      path: `/communities/${communityId}/admin`,
      breadcrumbName: 'Admin',
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Community</title>
      </Head>
      <div className="wrapper">
        <PageHeader
          avatar={{ src: community.iconUrl }}
          title={community.name}
          breadcrumb={{ routes, itemRender }}
        />
        {stripeAccountId ? (
          <CommunityAdminDashboard communityId={communityId} />
        ) : (
          <CommunitySetup
            communityId={communityId as string}
            navigate={router.push}
          />
        )}
      </div>
    </>
  );
};

export default CommunityAdmin;

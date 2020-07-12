import { PageHeader } from 'antd';
import Link from 'next/link';
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

const CommunityHero = ({ data, communityId }) => {
  if (!data) {
    return null;
  }

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
    <div
      style={{
        backgroundImage: `url('${data.bannerUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        paddingTop: '8em',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(5,32,39,0.5) 0%, rgba(6,36,43,1) 100%)',
        }}
      />
      <div className="wrapper">
        <PageHeader
          title={
            <div style={{ fontSize: '300%', lineHeight: '1.25' }}>
              {data.name}
            </div>
          }
          avatar={{ src: data.iconUrl, size: 64, shape: 'square' }}
          breadcrumb={{ routes, itemRender }}
        />
      </div>
    </div>
  );
};

export default CommunityHero;

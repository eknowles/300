import { PageHeader, Button } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const itemRender = (route, params, routes) => {
  const index = routes.indexOf(route);
  const last = index === routes.length - 1;

  if (last) {
    return <span>{route.breadcrumbName}</span>;
  }

  if (route.as) {
    return (
      <Link href={route.path} as={route.as}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>{route.breadcrumbName}</a>
      </Link>
    );
  }

  return (
    <Link href={route.path}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{route.breadcrumbName}</a>
    </Link>
  );
};

export interface ICommunityHeroProps {
  title: string;
  bannerUrl: string;
  iconUrl: string;
  isLarge?: boolean;
  routes: Array<{ path: string; breadcrumbName: string; as?: string }>;
}

const CommunityHero: React.FC<ICommunityHeroProps> = ({
  title,
  bannerUrl,
  iconUrl,
  isLarge,
  routes = [],
}) => {
  return (
    <div
      style={{
        backgroundImage: `url('${bannerUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        paddingTop: isLarge ? '8em' : '1em',
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
            'linear-gradient(180deg, rgba(5,29,39,0.75) 0%, rgba(5,29,39,1) 100%)',
        }}
      />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(5,29,39,1) 0%, rgba(5,29,39,1) 100%)',
        }}
      />
      <div className="wrapper">
        <PageHeader
          title={
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                style={{
                  fontSize: isLarge ? '300%' : '1em',
                  lineHeight: '1.25',
                }}
              >
                {title}
              </div>
            </motion.div>
          }
          avatar={{
            src: iconUrl,
            size: isLarge ? 64 : 'large',
            shape: 'square',
          }}
          breadcrumb={{ routes, itemRender }}
        />
      </div>
    </div>
  );
};

export default CommunityHero;

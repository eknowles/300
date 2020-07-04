require('dotenv').config();
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (_file) => {};
}

const DOMAINS = {
  development: 'http://localhost:3000',
  production: 'https://300.team',
  preview: 'https://dev.300.team',
};

module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental
  // variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  return {
    env: {
      PHASE: phase,
      IS_DEV: isDev,
      IS_PROD: isProd,
      IS_STAGING: isStaging,
      FAUNADB_SECRET: process.env.FAUNADB_SECRET,
      FAUNADB_PUBLIC_KEY: process.env.FAUNADB_PUBLIC_KEY,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
      ROOT_DOMAIN: isProd
        ? DOMAINS.production
        : isStaging
        ? DOMAINS.preview
        : DOMAINS.development,
    },
    ...withCss({
      cssModules: true,
    }),
    ...withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        importLoaders: 0,
      },
      cssLoaderOptions: {
        importLoaders: 3,
        localIdentName: '[local]___[hash:base64:5]',
      },
    }),
  };
};

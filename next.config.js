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
  dev: 'http://localhost:3000',
  prod: 'https://300.team',
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
      IS_PROD: isProd,
      IS_STAGING: isStaging,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
      ROOT_DOMAIN: isProd ? DOMAINS.prod : DOMAINS.dev,
      CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
      CONTENTFUL_PREVIEW_ACCESS_TOKEN:
        process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
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

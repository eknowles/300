import React from 'react';
import Head from 'next/head';
import { setTwoToneColor } from '@ant-design/icons';
import NextNprogress from 'nextjs-progressbar';
import BrochureLayout from 'app/components/layout';
import UserContextProvider from 'app/contexts/user.context';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { getDataFromTree } from '@apollo/react-ssr';
import fetch from 'isomorphic-fetch';

import '../assets/antd.less';
import '../assets/global.less';

setTwoToneColor('#1eaa0d');

const link = createHttpLink({
  uri: `${process.env.ROOT_DOMAIN}/api/graphql`,
  fetch,
});

const apollo = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="google-site-verification"
        content="jJEM2HJi1AU5A39kYqPtHVPzsyeRIJUhYNGFNFk1jeQ"
      />
      <meta name="robots" content="none" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <NextNprogress
      options={{ trickleSpeed: 100 }}
      showAfterMs={1000}
      spinner={false}
      color="#1eaa0d"
    />
    <ApolloProvider client={apollo}>
      <UserContextProvider>
        <BrochureLayout>
          <Component {...pageProps} />
        </BrochureLayout>
      </UserContextProvider>
    </ApolloProvider>
  </>
);

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
  let pageProps = {} as any;
  const apolloState = { data: {} };
  const { AppTree } = ctx;

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  if (typeof window === 'undefined') {
    if (ctx.res && (ctx.res.headersSent || ctx.res.finished)) {
      return pageProps;
    }

    try {
      const props = { ...pageProps, apolloState, apollo };
      const appTreeProps = 'Component' in ctx ? props : { pageProps: props };
      await getDataFromTree(<AppTree {...appTreeProps} />);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('GraphQL error occurred [getDataFromTree]', error);
    }

    Head.rewind();

    apolloState.data = apollo.cache.extract();
  }

  return { pageProps };
};

export default MyApp;

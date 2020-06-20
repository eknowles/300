import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { setTwoToneColor } from '@ant-design/icons';
import NextNprogress from 'nextjs-progressbar';
import BrochureLayout from 'app/components/layout';
import UserContextProvider from 'app/contexts/user.context';

import '../assets/antd.less';
import '../assets/global.less';

setTwoToneColor('#1eaa0d');

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
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
    <NextNprogress color="#1eaa0d" />
    <UserContextProvider>
      <BrochureLayout>
        <Component {...pageProps} />
      </BrochureLayout>
    </UserContextProvider>
  </>
);

export default MyApp;

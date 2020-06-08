import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { setTwoToneColor } from '@ant-design/icons';

setTwoToneColor('#1eaa0d');

import UserContextProvider from 'contexts/user.context';

import '../assets/antd.less';
import '../assets/global.less';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="jJEM2HJi1AU5A39kYqPtHVPzsyeRIJUhYNGFNFk1jeQ" />
        <meta name="robots" content="none" />
        <link rel="icon" href="/favicon.ico" />
        {/*<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap" rel="stylesheet" />*/}
        {/*<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" />*/}
      </Head>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  );
}

export default MyApp;

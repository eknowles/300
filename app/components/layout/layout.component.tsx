import React from 'react';
import Head from 'next/head';
import { Alert } from 'antd';
import Footer from '../footer';
import Header from '../header';

import './layout.less';

const BrochureLayout: React.FC = ({ children }) => {
  if (process.env.IS_PROD) {
    return (
      <>
        <Head>
          <title>Beta</title>
          <meta name="robots" content="none" />
        </Head>
        <Alert
          type="info"
          banner
          message="Sorry, we are not quite ready to show our site off just yet. We are still adding critical features. Please check back later."
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="none" />
      </Head>
      <div className="app">
        <Header />
        <div className="main">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default BrochureLayout;

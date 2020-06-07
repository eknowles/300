import Footer from 'components/footer';
import Header from 'components/header';
import React from 'react';
import Head from 'next/head';

import './layout.less';

const BrochureLayout = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="none" />
      </Head>
      <div className="app">
        <Header isBeta={true} />
        <div className="main">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BrochureLayout;

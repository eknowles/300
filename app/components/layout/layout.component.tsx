import React from 'react';
import Head from 'next/head';
import Footer from '../footer';
import Header from '../header';

import './layout.less';

const BrochureLayout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="none" />
      </Head>
      <div className="app">
        <Header isBeta={false} />
        <div className="main">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default BrochureLayout;

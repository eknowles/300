import Head from 'next/head';
import React from 'react';
import { Typography } from 'antd';

const GamesPage: React.FC = () => (
  <>
    <Head>
      <title>Game</title>
    </Head>
    <div className="wrapper">
      <Typography.Title style={{ marginTop: '30px' }}>
        Supported Games
      </Typography.Title>
    </div>
  </>
);

export default GamesPage;

import React from 'react';
import Head from 'next/head';
import BrochureLayout from 'app/components/layout';

const GamesPage: React.FC = () => (
  <BrochureLayout>
    <Head>
      <title>Game</title>
    </Head>
    <div>game index</div>
  </BrochureLayout>
);

export default GamesPage;

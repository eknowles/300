import BrochureLayout from 'components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const GamesPage = () => (
  <BrochureLayout>
    <Head>
      <title>Game</title>
    </Head>
    <div>game index</div>
  </BrochureLayout>
);

export default GamesPage;

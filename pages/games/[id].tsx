import BrochureLayout from 'components/layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const GamePage = (props) => (
  <BrochureLayout>
    <Head>
      <title>Game</title>
    </Head>
    <div>game</div>
    <div>{JSON.stringify(props)}</div>
  </BrochureLayout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      '/games/hell-let-loose'
    ], fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;

  return { props: { id } };
};

export default GamePage;

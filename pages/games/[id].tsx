import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';

const GamePage: React.FC = () => (
  <>
    <Head>
      <title>Game</title>
    </Head>
    <div>game</div>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['/games/hell-let-loose'],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;

  return { props: { id } };
};

export default GamePage;

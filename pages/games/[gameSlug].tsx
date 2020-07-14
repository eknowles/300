import { Typography } from 'antd';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';

const GamePage: React.FC<any> = ({ gameSlug }) => (
  <>
    <Head>
      <title>{gameSlug}</title>
    </Head>
    <div className="wrapper">
      <Typography.Title style={{ marginTop: '30px' }}>
        {gameSlug}
      </Typography.Title>
    </div>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['/games/hell-let-loose'],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { gameSlug } = params;

  // todo fetch content for this game

  return { props: { gameSlug } };
};

export default GamePage;

import { NextPage, NextPageContext } from 'next';
import { Result } from 'antd';
import React from 'react';

const Error: NextPage<{ statusCode: any }> = ({ statusCode }) => (
  <Result
    status={statusCode}
    title={statusCode}
    subTitle="Sorry, something went wrong."
  />
);

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  let { statusCode } = res;

  if (err) {
    statusCode = 404;
  }

  return { statusCode };
};

export default Error;

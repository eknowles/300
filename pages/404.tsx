import { Button, Result } from 'antd';
import React from 'react';
import Head from 'next/head';

const NotFound: React.FC = () => (
  <>
    <Head>
      <title>404 Not Found</title>
    </Head>
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary">Back Home</Button>}
    />
  </>
);

export default NotFound;

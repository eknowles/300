import { Typography } from 'antd';
import { NextPage } from 'next';
import React from 'react';

const { Title, Paragraph } = Typography;

const Support: NextPage = () => (
  <div className="wrapper">
    <Title level={1} style={{ marginTop: 30 }}>
      Support
    </Title>
    <Paragraph>
      We try to make the website as easy as possible to navigate and use. If you
      are having trouble try reading the frequently asked questions below.
      Alternatively just join our Discord where members of our staff are waiting
      to help you.
    </Paragraph>
    <a href="https://discord.gg/SjDbkZX">Talk with us</a>
  </div>
);

export default Support;

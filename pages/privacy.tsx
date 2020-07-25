import { Typography } from 'antd';
import { NextPage } from 'next';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const Privacy: NextPage = () => (
  <div className="wrapper">
    <Title level={1} style={{ marginTop: 30 }}>
      Privacy Policy
    </Title>
    <Paragraph>Privacy Policy</Paragraph>
  </div>
);

export default Privacy;

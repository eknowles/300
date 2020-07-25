import { Typography } from 'antd';
import { NextPage } from 'next';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const Terms: NextPage = () => (
  <div className="wrapper">
    <Title level={1} style={{ marginTop: 30 }}>
      Terms and Conditions
    </Title>
    <Paragraph>Terms and Conditions</Paragraph>
  </div>
);

export default Terms;

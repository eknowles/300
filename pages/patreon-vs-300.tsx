import { NextPage } from 'next';
import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AlternativeToPatreon: NextPage = () => {
  return (
    <div>
      <div className="wrapper">
        <Title>Looking for a Patron alternative? Meet 300.</Title>
        <Paragraph>
          Everything your gaming community needs to grow, at the same price!
        </Paragraph>
      </div>
    </div>
  );
};

export default AlternativeToPatreon;

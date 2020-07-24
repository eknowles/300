import { Result } from 'antd';
import React from 'react';
import { BuildOutlined } from '@ant-design/icons';

const InBeta: React.FC = () => {
  return (
    <Result
      icon={<BuildOutlined />}
      title="Nearly Ready!"
      subTitle="A number of features such as this one are still in active development."
    />
  );
};

export default InBeta;

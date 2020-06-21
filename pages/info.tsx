import { NextPage } from 'next';
import React from 'react';
import { Descriptions } from 'antd';

const InfoPage: NextPage = () => (
  <div className="wrapper">
    <Descriptions title="Info">
      <Descriptions.Item span={24} label="PHASE">
        {process.env.PHASE}
      </Descriptions.Item>
      <Descriptions.Item span={24} label="IS_DEV">
        {process.env.IS_DEV}
      </Descriptions.Item>
      <Descriptions.Item span={24} label="IS_PROD">
        {process.env.IS_PROD}
      </Descriptions.Item>
      <Descriptions.Item span={24} label="IS_STAGING">
        {process.env.IS_STAGING}
      </Descriptions.Item>
      <Descriptions.Item span={24} label="ROOT_DOMAIN">
        {process.env.ROOT_DOMAIN}
      </Descriptions.Item>
    </Descriptions>
  </div>
);

export default InfoPage;

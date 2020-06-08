import React, { useContext, useEffect, useState } from 'react';
import { ApartmentOutlined, PartitionOutlined } from '@ant-design/icons';
import { Typography, PageHeader, Statistic, Space, Divider, Card } from 'antd';
import { UserContext } from '../contexts/user.context';

const { Title } = Typography;

import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = value => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map(domain => `${value}${domain}`));
    }
  };

  const websiteOptions = autoCompleteResult.map(website => ({
    label: website,
    value: website,
  }));

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: 'Please input your first name!', whitespace: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: 'Please input your last name!', whitespace: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="country"
        label="Country"
        rules={[{ required: true, message: 'Please input country!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="locale"
        label="Language"
        rules={[{ required: true, message: 'Please input language!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Complete Registration
        </Button>
      </Form.Item>
    </Form>
  );
};

const SetupPage = () => {
  return (
    <div>
      <div className="wrapper">
        <Title level={3}>Complete your profile</Title>
        <RegistrationForm />
      </div>

      <div className="wrapper">
        <Title level={3}>Select an option</Title>
        <Row gutter={20} align={'middle'}>
          <Col span={12}>
            <Button size="large" block style={{ height: '200px' }} icon={<PartitionOutlined />}>
              I want to join a community
            </Button>
          </Col>
          <Col span={12}>
            <Button size="large" block style={{ height: '200px' }} icon={<ApartmentOutlined />}>
              I manage an existing community
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SetupPage;

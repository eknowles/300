import { Button, Checkbox, Form, Input, Select } from 'antd';
import React from 'react';

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 24,
      offset: 0,
    },
    md: {
      span: 18,
      offset: 6,
    },
  },
};

const { Option } = Select;

const countries = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'pl', label: 'Poland' },
];

const locales = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pl', label: 'Polish' },
];

const UpdateProfileForm: React.FC<{ initialValues?: any }> = ({
  initialValues,
}) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    // console.log('Received values of form: ', values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="profile"
      onFinish={onFinish}
      initialValues={{ ...initialValues, agreement: true }}
      scrollToFirstError
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email Address"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
            whitespace: false,
          },
        ]}
      >
        <Input type="email" disabled />
      </Form.Item>

      <Form.Item
        name="country"
        label="Country"
        rules={[{ required: true, message: 'Please input country!' }]}
      >
        <Select placeholder="Select your country">
          {countries.map((country) => (
            <Option key={country.value} value={country.value}>
              {country.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="locale"
        label="Language"
        rules={[{ required: true, message: 'Please input language!' }]}
      >
        <Select placeholder="Select your language">
          {locales.map((locale) => (
            <Option key={locale.value} value={locale.value}>
              {locale.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a>agreement</a>
        </Checkbox>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" size="large" htmlType="submit">
          Complete Registration
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfileForm;

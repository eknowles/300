import { Button, Form, Input, Select, Radio, DatePicker } from 'antd';
import { Moment } from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import qs from 'qs';

import countryCodes from 'app/constants/countries';

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

const countries = countryCodes.map((c) => ({ value: c.Code, label: c.Name }));

export interface IFormData {
  businessType: string;
  businessName: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  dob: Moment;
}

const StripeAccountCreateForm: React.FC<{
  initialValues?: any;
  submitText?: string;
  communityId: string;
}> = ({ initialValues, submitText, communityId }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: IFormData) => {
    const params = qs.stringify({
      communityId,
      businessType: values.businessType,
      businessName: values.businessName,
      email: values.email,
      country: values.country,
      firstName: values.firstName,
      lastName: values.lastName,
      dobDay: values.dob.date(),
      dobMonth: values.dob.month(),
      dobYear: values.dob.year(),
    });

    const url = `/api/oauth2/stripe/connect?${params}`;

    await router.push(url);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="StripeAccountCreateForm"
      onFinish={onFinish}
      initialValues={{ ...initialValues, agreement: true }}
      scrollToFirstError
    >
      <Form.Item
        label="Account Type"
        name="businessType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group>
          <Radio.Button value="individual">Individual</Radio.Button>
          <Radio.Button value="business">Business</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="businessName"
        label="Account Name"
        rules={[
          {
            required: true,
            message: 'Please input your communities business name!',
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
        <Input type="email" autoComplete="email" />
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
        <Input autoComplete="given-name" />
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
        <Input autoComplete="family-name" />
      </Form.Item>

      <Form.Item
        name="dob"
        label="Date of Birth"
        rules={[
          {
            required: true,
            message: 'Please input your date of birth!',
          },
        ]}
      >
        <DatePicker showToday={false} />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" size="large" htmlType="submit">
          {submitText || 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StripeAccountCreateForm;

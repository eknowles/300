import React, { useContext } from 'react';
import { Typography, Card, Avatar, Steps, Row, Col, Spin } from 'antd';
import UpdateProfileForm from 'app/components/community-setup/stripe-create-account-form';
import { UserContext } from 'app/contexts/user.context';

const { Title } = Typography;
const { Step } = Steps;

const SetupPage: React.FC = () => {
  const { user, fetched } = useContext(UserContext);

  if (!fetched || !user) {
    return <Spin />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Row style={{ minHeight: '100vh' }} gutter={32}>
        <Col>
          <Card style={{ minHeight: '100vh' }} bordered={false}>
            <Steps direction="vertical" current={1} onChange={() => 1}>
              <Step title="Sign in" description="Create your account" />
              <Step title="Complete Profile" description="Who you are" />
              <Step title="Join Community" description="Search and Filter" />
              <Step title="Join Squad" description="Make new friends" />
            </Steps>
          </Card>
        </Col>
        <Col span={12} style={{ minHeight: '100vh', alignItems: 'center' }}>
          <Title>Complete your profile</Title>
          <Card title="Who you are" extra={<Avatar src={user.avatarUrl} />}>
            {fetched && (
              <UpdateProfileForm
                initialValues={{
                  email: '',
                  locale: user.localeCode.split('-')[0],
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SetupPage;

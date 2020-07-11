import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, Steps, Typography, Space, Row, Col } from 'antd';
import StripeAccountCreateForm from './stripe-create-account-form';

const { Step } = Steps;
const { Text, Title } = Typography;

interface IProps {
  navigate: (url: string) => void;
  communityId: string;
}

const CommunitySetup: React.FC<IProps> = ({ communityId }) => {
  const { loading, data, error } = useQuery(
    gql`
      query CommunitySetup($communityId: ID!) {
        community: findCommunityProfileByID(id: $communityId) {
          name
          communityAccount {
            ownerAccount {
              email
            }
          }
        }
      }
    `,
    {
      variables: { communityId },
    }
  );

  if (loading || error || !data) {
    return null;
  }

  return (
    <Space size="large" direction="vertical">
      <Row align="middle" gutter={100}>
        <Col>
          <Title style={{ margin: 0 }}>Setup</Title>
        </Col>
        <Col flex={1}>
          <Steps size="small">
            <Step status="finish" title="Discord" />
            <Step status="process" title="Payments" />
            <Step status="wait" title="Verification" />
            <Step status="wait" title="Done" />
          </Steps>
        </Col>
      </Row>
      <Card
        title="Connect your account to Stripe"
        loading={loading}
        style={{ marginBottom: '10%' }}
      >
        <Space direction="vertical" size="large">
          <Text>
            We use Stripe to get you paid quickly and keep your personal and
            payment information secure. Thousands of companies around the world
            trust Stripe to process payments for their users. Set up a Stripe
            account to get paid with 300.team.
          </Text>
          <StripeAccountCreateForm
            communityId={communityId}
            submitText="Set up payments"
            initialValues={{
              businessType: 'individual',
              businessName: data.community.name,
              email: data.community.communityAccount.ownerAccount.email,
              country: 'GB',
            }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default CommunitySetup;

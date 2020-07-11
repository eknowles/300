import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Spin, Button, Result, Alert, Card } from 'antd';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { userProfileId } = router.query;
  const { loading, data, error } = useQuery(
    gql`
      query UserProfilePage($userProfileId: ID!) {
        profile: findUserProfileByID(id: $userProfileId) {
          username
          avatarUrl
          localeCode
        }
      }
    `,
    {
      variables: { userProfileId },
    }
  );

  if (loading || !data) return <Spin />;

  if (error) {
    return (
      <Result
        title="Error Fetching Profile"
        subTitle={error.message}
        extra={
          <Button type="primary" onClick={() => router.push('/')}>
            Go Back Home
          </Button>
        }
      />
    );
  }

  if (!data.profile) {
    return (
      <Result
        title="No User Found"
        subTitle="You might have the wrong User ID in the URL"
        extra={
          <Button type="primary" onClick={() => router.push('/')}>
            Go Back Home
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Head>
        <title>{data.profile.username}</title>
      </Head>
      <Card bordered={false}>
        <div className="wrapper">
          <Alert message="User profiles coming soon" banner />
        </div>
      </Card>
    </>
  );
};

export default ProfilePage;

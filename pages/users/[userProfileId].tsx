import { gql, useQuery } from '@apollo/client';
import { Button, Result, Spin } from 'antd';
import InBeta from 'app/components/in-beta';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { userProfileId } = router.query;
  const { loading, data, error } = useQuery(
    gql`
      query UserProfilePage($userProfileId: ID!) {
        profile: findUserProfileByID(id: $userProfileId) {
          username
        }
      }
    `,
    {
      variables: { userProfileId },
    }
  );

  if (loading || !data) return <Result icon={<Spin />} />;

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
      <InBeta />
    </>
  );
};

export default ProfilePage;

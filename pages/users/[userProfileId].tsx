import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { request } from 'graphql-request';
import useSWR from 'swr';
import { Spin, PageHeader, Button, Tag } from 'antd';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { userProfileId } = router.query;
  const { data, error } = useSWR(userProfileId, (id) =>
    request(
      '/api/graphql',
      `query ViewProfile($id: ID!) {
       profile: findUserProfileByID(id: $id) {
         username
         avatarUrl
       }
     }`,
      { id }
    )
  );

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>{data ? data.profile.username : 'Profile'}</title>
      </Head>
      <div className="wrapper">
        {!data && <Spin />}
        {data && (
          <div>
            <PageHeader
              onBack={() => router.back()}
              avatar={{ src: data.profile.avatarUrl, size: 64 }}
              title={
                <div style={{ fontSize: '3em', lineHeight: '1' }}>
                  {data.profile.username}
                </div>
              }
              tags={<Tag>{data?.profile.localeCode}</Tag>}
              subTitle="Profile"
              extra={<Button disabled>Add to Friends</Button>}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;

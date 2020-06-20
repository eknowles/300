import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Spin, Typography, PageHeader, Button, Tag } from 'antd';

const { Paragraph } = Typography;

const fetcher = (url, id) => {
  if (!id) {
    return Promise.reject();
  }

  return fetch(`${url}/${id}`).then((r) => r.json());
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const { data, error } = useSWR<any>([`/api/profiles`, profileId], fetcher);

  if (error) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="wrapper">
        {!data && <Spin />}
        {data && (
          <div>
            <PageHeader
              onBack={() => router.back()}
              avatar={{ src: data.avatarUrl }}
              title={data.username}
              tags={<Tag>{data.localeCode}</Tag>}
              subTitle="Profile"
              extra={<Button disabled>Add to Friends</Button>}
            >
              <Paragraph>Profile Descriptions Coming Soon</Paragraph>
            </PageHeader>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;

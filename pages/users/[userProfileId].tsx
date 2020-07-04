import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { request } from 'graphql-request';
import useSWR from 'swr';
import {
  Spin,
  Typography,
  PageHeader,
  Button,
  Tag,
  Avatar,
  Tabs,
  Card,
  Col,
  Row,
} from 'antd';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;

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
        <title>Profile</title>
      </Head>
      <div className="wrapper">
        {!data?.profile && <Spin />}
        {data?.profile && (
          <div>
            <PageHeader
              onBack={() => router.back()}
              avatar={{ src: data?.profile.avatarUrl }}
              title={data?.profile.username}
              tags={<Tag>{data?.profile.localeCode}</Tag>}
              subTitle="Profile"
              extra={<Button disabled>Add to Friends</Button>}
            >
              <Paragraph>Profile Descriptions Coming Soon</Paragraph>
            </PageHeader>
            <Row>
              <Col>
                <Avatar
                  shape="square"
                  size={128}
                  src={data?.profile.avatarUrl}
                />
                <Card>left</Card>
              </Col>
              <Col>
                <Title>{data?.profile.username}</Title>
                <div>
                  <Tabs defaultActiveKey="2">
                    <TabPane tab={<span>Tab 1</span>} key="1">
                      Tab 1
                    </TabPane>
                    <TabPane tab={<span>Tab 2</span>} key="2">
                      Tab 2
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;

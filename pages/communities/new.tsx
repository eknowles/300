import React from 'react';
import Head from 'next/head';
import {
  Col,
  List,
  PageHeader,
  Row,
  Typography,
  Avatar,
  Button,
  Alert,
  Space,
} from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';

const { Text } = Typography;

const itemRender = (route, params, routes) => {
  const last = routes.indexOf(route) === routes.length - 1;

  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={route.path}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{route.breadcrumbName}</a>
    </Link>
  );
};

const routes = [
  {
    path: '/',
    breadcrumbName: 'Home',
  },
  {
    path: '/communities',
    breadcrumbName: 'Communities',
  },
  {
    path: '/communities/new',
    breadcrumbName: 'New',
  },
];

type Data = Array<Record<'name' | 'id' | 'iconUrl', string>>;

const fetcher = (url) => fetch(url).then((r) => r.json());

const NewCommunity: React.FC = () => {
  const router = useRouter();
  const { data, error } = useSWR<Data>(`/api/guilds`, fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <>
      <Head>
        <title>Connect Your Community</title>
      </Head>
      <div className="wrapper">
        <PageHeader
          title="Connect Your Community"
          subTitle="Get Started"
          onBack={() => router.push('/communities')}
          breadcrumb={{ routes, itemRender }}
        />
        <Row>
          <Col>
            <Space direction="vertical" size="large">
              <Alert
                type="error"
                message="Community Requirements"
                description="We are currently only accepting new communities that have over 100 existing members whilst we build out the platform."
              />
              <List
                itemLayout="horizontal"
                header={<Text>Select a Discord Server</Text>}
                dataSource={data || []}
                loading={!data && !error}
                rowKey={(item) => item.id}
                size="large"
                renderItem={(item) => (
                  <List.Item actions={[<Button key="apply">Apply</Button>]}>
                    <List.Item.Meta
                      avatar={<Avatar size="large" src={item.iconUrl} />}
                      title={item.name}
                      description={item.id}
                    />
                  </List.Item>
                )}
              />
            </Space>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default NewCommunity;

import {
  Alert,
  Avatar,
  Button,
  Col,
  List,
  PageHeader,
  Row,
  Space,
  Typography,
} from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

const { Title } = Typography;

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
        <Title level={1} style={{ marginTop: 30 }}>
          Join
        </Title>
        <PageHeader title="Connect To Our Platform" />
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <List
            bordered
            itemLayout="horizontal"
            header="Select a Discord Guild"
            dataSource={data || []}
            loading={!data && !error}
            rowKey={(item) => item.id}
            size="large"
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="connect"
                    onClick={() =>
                      router.push(`/api/oauth2/discord/bot?guildId=${item.id}`)
                    }
                  >
                    Invite Bot
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" size="large" src={item.iconUrl} />
                  }
                  title={item.name}
                  description={item.id}
                />
              </List.Item>
            )}
          />
          <Alert
            type="info"
            message="Beta Requirements"
            description={
              <ul>
                <li>You must be based in the UK.</li>
                <li>Your Discord guild must have 100 members.</li>
              </ul>
            }
          />
        </Space>
      </div>
    </>
  );
};

export default NewCommunity;

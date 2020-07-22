import { Button, Layout, Menu, Space } from 'antd';
import { UserContext } from 'app/contexts/user.context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import UserMenu from '../user-menu';

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const login = () => router.push('/api/oauth2/discord/login');

  return (
    <Header>
      <div
        className="wrapper"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Space direction="horizontal" size="large">
          <div className="logo">
            <Link href="/">
              <a>
                <Space>
                  <div>300</div>
                </Space>
              </a>
            </Link>
          </div>
          <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
            <Menu.Item
              key="communities"
              onClick={() => router.push('/communities')}
            >
              Communities
            </Menu.Item>
          </Menu>
        </Space>

        <div className="auth">
          {user && user._id ? (
            <UserMenu />
          ) : (
            <Button type="primary" onClick={() => login()}>
              Sign in with Discord
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;

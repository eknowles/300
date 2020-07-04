import { Alert, Button, Space, Layout, Menu } from 'antd';
import { mistyrose } from 'color-name';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'app/contexts/user.context';
import UserMenu from '../user-menu';

const { Header } = Layout;

const bannerMessage = `This website is still in BETA. Features may be missing or not working as intended. Please visit our discord for the latest news and announcements.`;

const HeaderComponent: React.FC<{
  isBeta?: boolean;
  backgroundImage?: string;
}> = ({ isBeta }) => {
  const router = useRouter();
  const { user, fetched } = useContext(UserContext);
  const login = () => router.push('/api/oauth2/discord/login');
  const LoginButton = (
    <Button type="primary" onClick={() => login()}>
      Sign in with Discord
    </Button>
  );

  return (
    <div style={{ marginBottom: '24px' }}>
      {isBeta && <Alert type="info" message={bannerMessage} banner />}
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
              <Menu.Item key="events" disabled>
                Events
              </Menu.Item>
              <Menu.Item key="games" disabled>
                Games
              </Menu.Item>
              <Menu.Item key="news" disabled>
                News
              </Menu.Item>
            </Menu>
          </Space>

          <div className="auth">
            {fetched && user._id ? <UserMenu /> : LoginButton}
          </div>
        </div>
      </Header>
    </div>
  );
};

export default HeaderComponent;

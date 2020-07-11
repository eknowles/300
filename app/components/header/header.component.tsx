import { Alert, Button, Space, Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'app/contexts/user.context';
import { AnimatePresence, motion } from 'framer-motion';
import UserMenu from '../user-menu';

const { Header } = Layout;

const bannerMessage = `This website is still in BETA. Features may be missing or not working as intended. Please visit our discord for the latest news and announcements.`;

const AnimateInOut: React.FC = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const HeaderComponent: React.FC = () => {
  const router = useRouter();
  const { user, fetched } = useContext(UserContext);
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
          <AnimatePresence>
            {fetched && user && user._id ? (
              <AnimateInOut>
                <UserMenu />
              </AnimateInOut>
            ) : (
              <AnimateInOut>
                <Button type="primary" onClick={() => login()}>
                  Sign in with Discord
                </Button>
              </AnimateInOut>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;

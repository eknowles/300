import { Alert, Button, Space } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'app/contexts/user.context';
import UserMenu from '../user-menu';

const bannerMessage = `This website is still in BETA. Features may be missing or not working as intended. Please visit our discord for the latest news and announcements.`;

const Header: React.FC<{ isBeta?: boolean; backgroundImage?: string }> = ({
  isBeta,
}) => {
  const router = useRouter();
  const { user, fetched } = useContext(UserContext);
  const login = () => router.push('/api/oauth2/discord');
  const LoginButton = (
    <Button type="primary" onClick={() => login()}>
      Sign in with Discord
    </Button>
  );

  return (
    <div>
      {isBeta && <Alert type="info" message={bannerMessage} banner />}
      <div className="wrapper">
        <div className="header">
          <div className="logo">
            <Link href="/">
              <a>
                <Space>
                  <div>300</div>
                </Space>
              </a>
            </Link>
          </div>
          <div className="auth">
            {fetched && user.profileId ? <UserMenu /> : LoginButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

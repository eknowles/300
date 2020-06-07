import { Alert, Avatar, Button, Card } from 'antd';
import UserMenu from 'components/user-menu';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'contexts/user.context';

const bannerMessage = `This website is still in BETA. Features may be missing or not working as intended. Please visit our discord for the latest news and announcements.`;

const Header: React.FC<{ isBeta?: boolean, backgroundImage?: string }> = ({ isBeta, backgroundImage }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const login = () => router.push('/api/oauth2/discord');
  const LoginButton = <Button type="primary" size="large" onClick={() => login()}>Sign in with Discord</Button>;

  return (
    <div>
      {isBeta && <Alert type="info" message={bannerMessage} banner />}
      <div className="wrapper">
        <div className="header">
          <div className="logo">
            <Link href={`/`}>
              <a>
                <div className="brand">300<span>.team</span></div>
              </a>
            </Link>
            <div className="motto"><span>Communities Made Simple</span></div>
          </div>
          <div className="auth">
            {user.id ? <UserMenu /> : LoginButton }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

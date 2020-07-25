import { Avatar, Menu } from 'antd';
import { UserContext } from 'app/contexts/user.context';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

const { SubMenu } = Menu;

const UserMenu: React.FC = () => {
  const router = useRouter();
  const {
    logout,
    user: { username, avatarUrl, _id },
  } = useContext(UserContext);

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
      <SubMenu
        icon={
          <Avatar src={avatarUrl} style={{ marginRight: '0.75em' }}>
            {username[0]}
          </Avatar>
        }
        title={username}
      >
        <Menu.Item key="dashboard" onClick={() => router.push('/dashboard')}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="profile" onClick={() => router.push(`/users/${_id}`)}>
          Profile
        </Menu.Item>
        <Menu.Item
          key="billing"
          onClick={() =>
            router.push(`/api/stripe/connect?action=openBillingPortal`)
          }
        >
          Billing
        </Menu.Item>
        <Menu.Item key="logout" onClick={() => logout()}>
          Logout
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default UserMenu;

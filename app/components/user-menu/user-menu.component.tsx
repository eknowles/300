import { Avatar, Space, Menu } from 'antd';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { UserContext } from 'app/contexts/user.context';

const UserMenu: React.FC = () => {
  const router = useRouter();
  const {
    user: { username, avatarUrl },
  } = useContext(UserContext);

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
      <Menu.Item key="dashboard" onClick={() => router.push('/dashboard')}>
        <Space>
          {username}
          <Avatar src={avatarUrl}>{username[0]}</Avatar>
        </Space>
      </Menu.Item>
    </Menu>
  );
};

export default UserMenu;

import { Avatar, Typography, Space } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from 'contexts/user.context';

const UserMenu: React.FC = () => {
  const { user } = useContext(UserContext);
  const { username, avatar } = user;

  return (
    <Link href="/dashboard">
      <a>
        <Space>
          <Typography.Text>{username}</Typography.Text>
          <Avatar src={avatar}>{username[0]}</Avatar>
        </Space>
      </a>
    </Link>
  );
};

export default UserMenu;

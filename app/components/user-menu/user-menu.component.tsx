import { Avatar, Typography, Space } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from 'app/contexts/user.context';

const UserMenu: React.FC = () => {
  const {
    user: { userProfile },
  } = useContext(UserContext);
  const { username, avatarUrl } = userProfile;

  return (
    <Link href="/dashboard">
      <a>
        <Space>
          <Typography.Text>{username}</Typography.Text>
          <Avatar src={avatarUrl}>{username[0]}</Avatar>
        </Space>
      </a>
    </Link>
  );
};

export default UserMenu;

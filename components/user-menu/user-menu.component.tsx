import { Avatar, Typography, Space } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from 'contexts/user.context';

const UserMenu: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <Link href="/dashboard">
      <a>
        <Space>
          <Typography.Text>{user.username}</Typography.Text>
          <Avatar src={user.imageUrl} />
        </Space>
      </a>
    </Link>
  );
};

export default UserMenu;

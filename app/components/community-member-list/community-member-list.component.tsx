import { Avatar, List, Space, Typography } from 'antd';
import formatDate from 'app/helpers/date';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const variants = {
  start: {
    opacity: 0,
    x: 5,
  },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      type: 'spring',
      damping: 10,
      stiffness: 100,
    },
  }),
};

const { Text } = Typography;

interface ICommunityMemberListProps {
  header?: any;
  loading?: boolean;
  items: any[];
}

const CommunityMemberList: React.FC<ICommunityMemberListProps> = ({
  header,
  items,
  loading,
}) => {
  return (
    <List
      style={{ marginBottom: '1em' }}
      header={header}
      itemLayout="horizontal"
      dataSource={items}
      loading={loading}
      renderItem={(item, index) => (
        <List.Item style={{ lineHeight: '1.2' }}>
          <Space>
            <motion.div
              custom={index}
              initial="start"
              animate="visible"
              variants={variants}
            >
              <Avatar size={30} src={item.userProfile.avatarUrl} />
            </motion.div>
            <Space direction="vertical" size={0}>
              <motion.div
                custom={index + 0.2}
                initial="start"
                animate="visible"
                variants={variants}
              >
                <Link
                  href="/users/[userProfileId]"
                  as={`/users/${item.userProfile._id}`}
                >
                  <a style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    {item.userProfile.username}
                  </a>
                </Link>
              </motion.div>
              <motion.div
                custom={index + 0.4}
                initial="start"
                animate="visible"
                variants={variants}
              >
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatDate(item.createdAt)}
                </Text>
              </motion.div>
            </Space>
          </Space>
        </List.Item>
      )}
    />
  );
};

export default CommunityMemberList;

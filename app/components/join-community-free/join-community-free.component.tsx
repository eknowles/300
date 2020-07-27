import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalContent = () => (
  <div>
    By clicking yes, you will join the community. We will automatically invite
    you to our discord and give you the rookie role.
  </div>
);

const JOIN_COMMUNITY = gql`
  mutation JoinCommunity($id: ID!) {
    joinCommunity(communityProfileID: $id) {
      _id
    }
  }
`;

const JoinCommunityFree: React.FC<{ id: string }> = ({ id }) => {
  const [joining, setJoining] = useState(false);
  const [joinCommunity] = useMutation(JOIN_COMMUNITY);

  async function onOk() {
    setJoining(true);
    try {
      await joinCommunity({ variables: { id } });
      message.success('Joined Community!');
    } catch (e) {
      message.error(e.message);
    } finally {
      setJoining(false);
    }
  }

  function confirm() {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: <ModalContent />,
      okText: 'Yes, Join',
      cancelText: 'Cancel',
      onOk,
    });
  }

  return (
    <div>
      <Button block type="primary" onClick={confirm} loading={joining}>
        Join Community
      </Button>
    </div>
  );
};

export default JoinCommunityFree;

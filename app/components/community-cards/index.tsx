import { Card, Tag, Space, Avatar } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

import './community-card.less';

const { CheckableTag } = Tag;
const { Meta } = Card;

const tagsData = ['Recruiting', 'English', 'German', 'French'];

const DEFAULT_COVER_IMG =
  'https://images.unsplash.com/photo-1480506132288-68f7705954bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3386&q=80';

export const CommunityCard: React.FC<any> = ({
  id,
  name,
  imageUrl = DEFAULT_COVER_IMG,
  avatarUrl,
}) => (
  <Link href="/communities/[communityId]" as={`/communities/${id}`}>
    <Card
      hoverable
      cover={
        imageUrl && (
          <img className="card-image" alt="Community" src={imageUrl} />
        )
      }
    >
      <Meta
        title={name}
        avatar={<Avatar src={avatarUrl} shape="square" size={56} />}
      />
    </Card>
  </Link>
);

const CommunityCards: React.FC<any> = () => {
  const [selectedTags, setSelectedTags] = useState(['']);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  return (
    <Space direction="vertical" size="large">
      <div>
        {tagsData.map((tag) => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={(checked) => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </div>
      <div>
        <CommunityCard
          name="FFUK"
          imageUrl="https://static.wixstatic.com/media/0a29d2_287e118b52524d4abeefe1c68fc4c4b4~mv2.jpg/v1/fill/w_863,h_394,al_c,lg_1,q_80/FF2.webp"
        />
      </div>
    </Space>
  );
};

export default CommunityCards;

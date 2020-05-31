import { Card, Tag, Space } from 'antd';
import React, { useState } from 'react';

import './battalion-card.less';

const { CheckableTag } = Tag;
const { Meta } = Card;

const tagsData = ['Recruiting', 'English', 'German', 'French'];

const BattalionCards = () => {
  const [selectedTags, setSelectedTags] = useState(['']);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
  }

  return (
    <Space direction="vertical" size="large">
      <div>
        {tagsData.map(tag => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </div>
      <div>
        <Card
          style={{ width: 300 }}
          cover={
            <img
              className="card-image"
              alt="Battalion"
              src="https://static.wixstatic.com/media/0a29d2_287e118b52524d4abeefe1c68fc4c4b4~mv2.jpg/v1/fill/w_863,h_394,al_c,lg_1,q_80/FF2.webp"
            />
          }
        >
          <Meta
            title="Fighting Furies UK"
            description={
              <Space direction="vertical">
                <div>120 Members</div>
                <div>
                  <Tag>Recruiting</Tag>
                  <Tag>English</Tag>
                </div>
              </Space>
            }
          />
        </Card>
      </div>
    </Space>
  )
}

export default BattalionCards;

import Link from 'next/link';
import React from 'react';
import { List, Typography } from 'antd';

import './footer.less';

const { Text } = Typography;

const data = [
  {
    title: 'Featured Communities',
    links: [
      { label: 'Your Team Here', href: '/c/yth', disabled: true },
      { label: 'Your Team Here', href: '/c/yth', disabled: true },
      { label: 'Your Team Here', href: '/c/yth', disabled: true },
    ],
  },
  {
    title: 'Supported Games',
    links: [
      {
        label: 'Hell Let Loose',
        href: '/games/hell-let-loose',
        disabled: false,
      },
      { label: 'Squad', href: '/ganes/squad', disabled: true },
      { label: 'GTA V', href: '/games/gta', disabled: true },
    ],
  },
  {
    title: 'About 300.team',
    links: [
      {
        label: 'For Community Owners',
        href: '/community-owners',
        disabled: true,
      },
      { label: 'For Players', href: '/for-players', disabled: true },
      {
        label: 'For Server Hosting Companies',
        href: '/server-hosting-companies',
        disabled: true,
      },
    ],
  },
  {
    title: 'Supported Regions',
    links: [
      { label: 'Europe', href: '/region/eu', disabled: true },
      { label: 'North America', href: '/region/na', disabled: true },
      { label: 'Australia', href: '/region/au', disabled: true },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/developers/docs', disabled: true },
      { label: 'Webhooks', href: '/developers/webhooks', disabled: true },
      {
        label: 'Integrations',
        href: '/developers/integrations',
        disabled: true,
      },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="wrapper">
        <List
          grid={{
            column: 5,
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item.title}</Text>
              {item.links.map((i) => (
                <div key={i.href}>
                  {i.disabled ? (
                    <Text disabled>{i.label}</Text>
                  ) : (
                    <Link href={i.href}>
                      <a>{i.label}</a>
                    </Link>
                  )}
                </div>
              ))}
            </List.Item>
          )}
        />
      </div>
    </footer>
  );
};

export default Footer;

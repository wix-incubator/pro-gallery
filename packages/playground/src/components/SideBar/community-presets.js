// @ts-check

import React, { useEffect, useState } from 'react';
import { List, Avatar, Icon } from 'antd';
import { LikeOutline } from '@ant-design/icons';

import { getAll } from '../../data';

const baseUrl = window.location.href.split('?')[0];

function CommunityPresets() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAll().then((data) => {
      setItems(
        data.map((item) => ({
          href: `${baseUrl}?${item.url}`,
          title: item.title,
          avatar: 'https://avatars.githubusercontent.com/u/2863693?s=120&v=4',
          description: item.description,
        }))
      );
    });
  });

  return (
    <List
      itemLayout='vertical'
      size='large'
      pagination={{
        pageSize: 3,
      }}
      dataSource={items}
      renderItem={(item) => (
        <List.Item
          key={item.title}
          actions={[
            <button>
              <Icon type={LikeOutline.name} />
            </button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href={item.href}>{item.title}</a>}
            description={item.description}
          />
          {item.description}
        </List.Item>
      )}
    />
  );
}

export { CommunityPresets };

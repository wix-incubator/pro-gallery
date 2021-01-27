import React, { useEffect, useState } from 'react';
import { List, Avatar, Button } from 'antd';
import { LikeOutline } from '@ant-design/icons';

import { getAll, like } from '../../data';

const baseUrl = window.location.href.split('?')[0];

function CommunityPresets() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAll().then((data) => {
      setItems(
        data.map((item) => ({
          id: item.id,
          href: `${baseUrl}?${item.url}`,
          title: item.title,
          avatar: 'https://avatars.githubusercontent.com/u/2863693?s=120&v=4',
          description: item.description,
          likes: item.likes || 0
        }))
      );
    });
  }, []);

  const onClickLike = itemToLike => {
    const newItem = {
      ...itemToLike,
      likes: ++itemToLike.likes
    };
    const newItems = items.map(item => {
      return Object.is(item, itemToLike) ? newItem : item
    });
    setItems(newItems);
    like(newItem);
  }

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
            <Button onClick={() => onClickLike(item)} icon={LikeOutline.name}>{item.likes}</Button>
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

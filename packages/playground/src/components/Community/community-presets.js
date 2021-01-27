import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Button } from 'antd';
import { RightCircleOutline, LikeOutline } from '@ant-design/icons';
import { GalleryPreview } from './galleryPreview';
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
          likes: item.likes || 0,
          options: item.url.split('&').map((params) => params.split('=')).reduce((options, [key, val]) => ({ ...options, [key]: val }), {})
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

  return items
    .sort((item1, item2) => item2.likes - item1.likes)
    .map(item => (
      <Card
        cover={<GalleryPreview item={item} />}
        actions={[
          <Button type="link" size="large" onClick={() => onClickLike(item)} icon={LikeOutline.name}> Like ({item.likes})</Button>,
          <Button type="link" size="large" href={item.href} icon={RightCircleOutline.name}>Load Layout</Button>
        ]}
        style={{
          margin: '20px 0',
          overflow: 'hidden',
          borderRadius: 10
        }}
      >
        <Card.Meta
          title={item.title}
          description={item.description}
        />
      </Card>
  ))
    ;
  // return (
  //   <List
  //     itemLayout='vertical'
  //     size='large'
  //     pagination={{
  //       pageSize: 3,
  //     }}
  //     dataSource={items}
  //     renderItem={(item) => (
  //       <List.Item
  //         key={item.title}
  //         actions={[
  //           <Button onClick={() => onClickLike(item)} icon={LikeOutline.name}>{item.likes}</Button>
  //         ]}
  //       >
  //         <List.Item.Meta
  //           avatar={<Avatar src={item.avatar} />}
  //           title={<a href={item.href}>{item.title}</a>}
  //           description={item.description}
  //         />
  //         {item.description}
  //         <GalleryPreview item={item}/>
  //       </List.Item>
  //     )}
  //   />
  // );
}

export { CommunityPresets };

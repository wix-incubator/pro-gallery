import React, { useEffect, useState } from 'react';
import { Icon, Card, Button } from 'antd';
import { ArrowUpOutline, ArrowDownOutline } from '@ant-design/icons';
import { GalleryPreview } from './galleryPreview';
import { getAll, like } from '../../data';
import { formatValue } from "../../utils/utils";

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
          options: item.url.replace('?','').split('&').map((params) => params.split('=')).reduce((options, [key, val]) => ({ ...options, [key]: formatValue(val) }), {})
        }))
      );
    });
  }, []);

  const onClickLike = (itemToLike, diff = 1) => {
    const curDiff = Number(localStorage.getItem('vote_' + itemToLike.id));
    if (curDiff === diff)
      return;
    localStorage.setItem('vote_' + itemToLike.id, diff);
    if (-curDiff === diff)
      diff *= 2;
    
    const newItem = {
      ...itemToLike,
      likes: itemToLike.likes + diff
    };
    const newItems = items.map(item => Object.is(item, itemToLike) ? newItem : item);
    setItems(newItems);
    like(newItem);
  }

  const isLiked = item => !!(localStorage.getItem('vote_' + item.id));
  const isUpvoted = item => Number(localStorage.getItem('vote_' + item.id)) > 0;
  const isDownvoted = item => Number(localStorage.getItem('vote_' + item.id)) < 0;

  return items
    .filter(item => item.likes > -5)
    .sort((item1, item2) => item2.likes - item1.likes)
    .map(item => (
      <Card
        cover={<a href={item.href}><GalleryPreview item={item} /></a>}
        actions={[
          <Button type="link" disabled={isDownvoted(item)} size="large" onClick={() => onClickLike(item, -1)} icon={ArrowDownOutline.name}></Button>,
          <Button type="link" disabled={isUpvoted(item)} size="large" onClick={() => onClickLike(item, 1)} icon={ArrowUpOutline.name}></Button>,
          <Button type="link" size="large"><Icon type="star" theme={isLiked(item) ? 'filled' : 'outlined'}/>  {item.likes}</Button>,
        ]}
        style={{
          margin: '20px 0',
          overflow: 'hidden',
          borderRadius: 10
        }}
      >
        <Card.Meta
          title={<a href={item.href}>{item.title}</a>}
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

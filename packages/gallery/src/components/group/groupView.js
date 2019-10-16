import React from 'react';
import itemView from '../item/itemView.js';
import { GalleryComponent } from '../galleryComponent';

class GroupView extends GalleryComponent {
  constructor(props) {
    super(props);
    this.displayName = 'GroupView';
    this.dom = [];
    this.state = {};
  }

  createDom(visible) {
    return this.props.items.map(item =>
      React.createElement(
        itemView,
        {
          ...item.renderProps(Object.assign(this.props.galleryConfig, { visible })),
          ...this.props.itemsLoveData[item.id]
        },
      ),
    );
  }

  shouldRender() {
    const {items, galleryConfig} = this.props;
    if (!items || !items.length) {
      return false;
    }
    if (this.props.allowLoop) {
      const {idx} = items[items.length - 1];
      const {currentIdx, totalItemsCount} = galleryConfig;
      
      const distance = currentIdx - idx;
      const padding = Math.floor(totalItemsCount / 2);
      
      return (Math.abs(distance) <= padding);
    }
    
    return true;
  }

  render() {
    return this.shouldRender() ? (
      <div key={`group_${this.props.idx}_${this.props.items[0].id}`} data-hook={'group-view'}>
        {this.createDom(true)}
      </div>
    ) : null;
  }
}

export default GroupView;

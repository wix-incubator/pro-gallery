import React from 'react';
import ItemView from '../item/itemView.js';
import { GalleryComponent } from '../galleryComponent';

class GroupView extends GalleryComponent {
  constructor(props) {
    super(props);
    this.displayName = 'GroupView';
    this.dom = [];
    this.state = {};
  }

  createDom(visible) {
    return this.props.items.map((item) => (
      <ItemView
        {...{
          ...item.renderProps({ ...this.props.galleryConfig, visible }),
          ...this.props.itemsLoveData[item.id],
        }}
      />
    ));
  }

  shouldRender() {
    const { items } = this.props;
    if (!items || !items.length || !items[0]) {
      return false;
    }

    return true;
  }

  isVisible() {
    const { items, galleryConfig } = this.props;

    if (this.props.allowLoop) {
      const { idx } = items[items.length - 1];
      const { currentIdx, totalItemsCount } = galleryConfig;

      const distance = currentIdx - idx;
      const padding = Math.floor(totalItemsCount / 2);

      return Math.abs(distance) <= padding;
    }

    return true;
  }

  render() {
    return this.shouldRender() ? (
      <div
        key={`group_${this.props.idx}_${this.props.items[0].id}`}
        data-hook={'group-view'}
        aria-hidden={this.props.ariaHidden}
      >
        {this.createDom(this.isVisible())}
      </div>
    ) : null;
  }
}

export default GroupView;

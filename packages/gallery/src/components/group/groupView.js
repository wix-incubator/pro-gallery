import React from 'react';
import ItemContainer from '../item/itemContainer.js';
import _ from 'lodash';
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
        ItemContainer,
        _.merge(
          item.renderProps(_.merge(this.props.galleryConfig, { visible })),
          { ...this.props.itemsLoveData[item.id] },
        ),
      ),
    );
  }

  render() {
    return (
      <div key={`group_${this.props.idx}`} data-hook={'group-view'}>
        {this.createDom(true)}
      </div>
    );
  }
}

export default GroupView;

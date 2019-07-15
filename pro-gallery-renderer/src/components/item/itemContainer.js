import React from 'react';

import ItemView from './itemView.js';
import { CommonItemContainer } from './commonItemContainer.js';
import { GalleryComponent } from '../galleryComponent';

class ItemContainer extends GalleryComponent {
  render() {
    return <ItemView layout="galleryItem" className="image" {...this.props} />;
  }
}

export default CommonItemContainer(ItemContainer);

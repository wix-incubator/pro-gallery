import React from 'react';
import ItemView from './itemView.js';
import { GalleryComponent } from '../galleryComponent';

class ItemContainer extends GalleryComponent {
  render() {
    return <ItemView layout="galleryItem" className="image" {...this.props} />;
  }
}

export default ItemContainer;

import React from 'react';
import { GalleryComponent } from '../../galleryComponent';

export default class ItemTitle extends GalleryComponent {
  render() {
    const { title, style, spanStyle } = this.props;
    return (
      <div
        className={`gallery-item-title`}
        data-hook="item-title"
        style={style}
      >
        <span style={spanStyle}>{title}</span>
      </div>
    );
  }
}

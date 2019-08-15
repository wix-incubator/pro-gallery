import React from 'react';
import { GalleryComponent } from '../../galleryComponent';

export default class ItemDescription extends GalleryComponent {
  render() {
    const { description, style, spanStyle } = this.props;
    return (
      <div
        className={'gallery-item-description'}
        data-hook="item-description"
        style={style}
      >
        {description.split('\n').map((i, key) => {
          return (
            <span key={key} style={spanStyle}>
              {i}
              <br />
            </span>
          );
        })}
      </div>
    );
  }
}

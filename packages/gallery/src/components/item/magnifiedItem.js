import React from 'react';
import { GalleryComponent } from '../galleryComponent';
import ImageRenderer from './imageRenderer';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

export default class magnifiedItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
  }

  onDragStart(e) {
    e.preventDefault();
  }
  render() {
    const { createUrl } = this.props;
    console.log(createUrl);
    const src = createUrl(
      GALLERY_CONSTS.urlSizes.MAGNIFIED,
      GALLERY_CONSTS.urlTypes.HIGH_RES
    );
    return (
      <div
        style={{
          zIndex: 1000,
          position: 'relative',
          cursor: 'grab',
          top: this.state.y,
          left: this.state.x,
        }}
        onDragStart={this.onDragStart}
        oncli
      >
        <ImageRenderer
          key={'magnified-item'}
          className={`magnified-item`}
          data-hook="magnified-item"
          src={src}
          alt={'untitled image'}
          id={this.props.id}
          // style={{
          //   ...imageSizing,
          //   ...blockDownloadStyles,
          //   ...(!shouldRenderHighResImages && preloadStyles),
          // }}
          // {...imageProps}
        />
      </div>
    );
  }
}

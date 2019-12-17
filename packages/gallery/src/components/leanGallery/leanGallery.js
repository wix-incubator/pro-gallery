import React from 'react';
// import GalleryItem from '../item/galleryItem';

import GALLERY_SIZE_TYPE from '../../common/constants/gallerySizeType';

const get = (item, attr) => {
  if (typeof item[attr] !== 'undefined') {
    return item[attr]
  }
  if (typeof item.metadata !== 'undefined') {
    if (typeof item.metadata[attr] !== 'undefined') {
      return item.metadata[attr]
    }
  }
  
  if (typeof item.metaData !== 'undefined') {
    if (typeof item.metaData[attr] !== 'undefined') {
      return item.metaData[attr]
    }
  }
  
}
export default class LeanGallery extends React.Component {

  constructor() {
    super();
    this.state = {
      itemStyle: {}
    };
  }

  resizeUrl({ item }) {

    const { styles, resizeMediaUrl } = this.props;
    const { cubeType, imageQuality } = styles;
    const { itemStyle } = this.state;
    const isPreload = !(itemStyle.width > 0)
    if (isPreload) {
      return '';
    }
    const { url, mediaUrl, src } = item;
    const itemUrl = url || mediaUrl || src;

    const width = itemStyle.width || 250;
    const height = itemStyle.height || 250;
    const focalPoint = false;

    if (typeof resizeMediaUrl === 'function') {
      try {
        return resizeMediaUrl({
          maxWidth: get(item, 'width'),
          maxHeight: get(item, 'height'),
        }, itemUrl, cubeType, width, height, {quality: imageQuality}, false, focalPoint) || '';
      } catch (e) {
        return String(itemUrl);
      }
    } else {
      return String(itemUrl);
    }
  };

  calcItemSize() {
    const { styles, container } = this.props;
    const { gallerySizeType, gallerySize, gallerySizePx, gallerySizeRatio } = styles;
    
    let itemSize;

    if (gallerySizeType === GALLERY_SIZE_TYPE.PIXELS && gallerySizePx > 0) {
      itemSize = gallerySizePx;
    } else if (gallerySizeType === GALLERY_SIZE_TYPE.RATIO && gallerySizeRatio > 0) {
      itemSize = container.width * (gallerySizeRatio / 100);
    } else {
      itemSize = Math.round(gallerySize * 8.5 + 150)
    }

    return Math.min(itemSize, container.width);
  }

  createGalleryStyle() {
    const { styles } = this.props;
    const { gridStyle, numberOfImagesPerRow, imageMargin } = styles;
    const gridTemplateColumns = gridStyle === 1 ? `repeat(${numberOfImagesPerRow}, 1fr)` : `repeat(auto-fit, minmax(${this.calcItemSize()}px, 1fr))`;

    return {
      display: 'grid',
      gridTemplateColumns,
      gridGap: `${imageMargin}px`
    };

  }

  createItemStyle() {
    const { styles } = this.props;
    const { 
      cubeType,
      itemBorderWidth: borderWidth,
      itemBorderColor: borderColor,
      itemBorderRadius: borderRadius
    } = styles;

    return {
      ...this.state.itemStyle,
      objectFit: cubeType === 'fit' ? 'contain' : 'cover',
      borderWidth,
      borderColor,
      borderRadius
    }
  }

  measure(node) {
    const { styles } = this.props;
    node && !this.state.itemStyle.width &&
      this.setState({
        itemStyle: {
          width: node.clientWidth,
          height: Math.round(node.clientWidth / styles.cubeRatio),
        }
      });
  }

  render() {

    const { items } = this.props;

    return (
      <div style={this.createGalleryStyle()}>
        {items.map(item => {
          const src = this.resizeUrl({ item })
          return (
            <div
              style={{
                overflow: 'hidden',
                height: this.state.itemStyle.height
              }}
              ref={this.measure.bind(this)}
            >
              <img 
                src={src} 
                loading="lazy" 
                alt={get(item, 'title')} 
                style={this.createItemStyle()}
                // onClick={() => this.props.eventsListener('ITEM_ACTION_TRIGGERED', new GalleryItem(item))}
              />
            </div>
          )
        })
        }
      </div >
    )
  }
}

/* 
todo: 
  itemClick
  links
  Events
  Texts
  auto render by styleParams
 */
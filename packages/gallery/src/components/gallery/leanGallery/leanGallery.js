import React from 'react';
// import GalleryItem from '../item/galleryItem';

import EVENTS from '../../../common/constants/events';
import GALLERY_SIZE_TYPE from '../../../common/constants/gallerySizeType';
import CROP_TYPES from '../../../common/constants/resizeMethods'
import s from './leanGallery.module.scss';

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
    
    this.measureIfNeeded = this.measureIfNeeded.bind(this);

    this.state = {
      itemStyle: {}
    };
  }

  componentDidMount() {
    this.props.eventsListener(EVENTS.APP_LOADED, {});
  }

  resizeUrl({ item }) {

    const { styles, resizeMediaUrl } = this.props;
    const { cubeType, imageQuality } = styles;
    const { itemStyle } = this.state;

    const { url, mediaUrl, src } = item;
    const itemUrl = url || mediaUrl || src;

    const width = itemStyle.width || 250;
    const height = itemStyle.height || 250;
    const focalPoint = false;

    const isPreload = !(itemStyle.width > 0)
    const options = isPreload ? {quality: 30, blur: 30} : {quality: imageQuality};

    if (typeof resizeMediaUrl === 'function') {
      try {
        return resizeMediaUrl({
          maxWidth: get(item, 'width'),
          maxHeight: get(item, 'height'),
        }, itemUrl, cubeType, width, height, options, false, focalPoint) || '';
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
      itemSize = Math.round(gallerySize * 8.5 + 150);
    }

    const minmaxFix = 0.75; //this fix is meant to compensate for the css grid ability to use the number as a minimum only (the pro-gallery is trying to get as close as possible to this number)
    itemSize *= minmaxFix;

    return Math.min(itemSize, container.width);
  }

  createGalleryStyle() {
    const { styles } = this.props;
    const { gridStyle, numberOfImagesPerRow, imageMargin } = styles;
    const gridTemplateColumns = gridStyle === 1 ? `repeat(${numberOfImagesPerRow}, 1fr)` : `repeat(auto-fit, minmax(${this.calcItemSize()}px, 1fr))`;

    return {
      gridTemplateColumns,
      gridGap: `${imageMargin}px`
    };

  }

  createItemStyle() {
    const { styles } = this.props;
    const { 
      itemBorderWidth: borderWidth,
      itemBorderColor: borderColor,
      itemBorderRadius: borderRadius
    } = styles;

    return {
      borderWidth,
      borderColor,
      borderRadius
    }
  }

  getImageSize(image) {
    const { styles } = this.props;
    if (styles.cubeType !== CROP_TYPES.FIT) {
      return this.state.itemStyle
    }

    const {width, height} = this.state.itemStyle;
    const imageWidth = get(image, 'width');
    const imageHeight = get(image, 'height');
    const imageRatio = imageWidth / imageHeight;
    const containerRatio = width / height
    if (imageRatio > containerRatio) {
      //image is wider than container
      const _height = width / imageRatio;
      return {
        width,
        height: _height ,
        marginTop: (height - _height) / 2
      }
    } else {
      const _width = height * imageRatio;
      return {
        height,
        width: _width,
        marginLeft: (width - _width) / 2

      }
    }
  }

  measureIfNeeded(node) {
    const { styles } = this.props;
    if (!this.node && node) {
      this.node = node;
    }
    if (this.node && (this.node.clientWidth !== this.clientWidth)) {
      this.clientWidth = this.node.clientWidth;
      this.setState({
        itemStyle: {
          width: this.clientWidth,
          height: Math.round(this.clientWidth / styles.cubeRatio),
        }
      });
    }
  }

  componentDidUpdate() {
    this.measureIfNeeded();
  }

  render() {

    const { items } = this.props;

    return (
      <div 
        className={['pro-gallery', 'inline-styles', s.gallery].join(' ')}
        style={this.createGalleryStyle()}
      >
        {items.map(item => {
          return (
            <div
              className={['gallery-item-container', s.cell].join(' ')}
              style={{
                height: this.state.itemStyle.height
              }}
              ref={this.measureIfNeeded}
              >
              <div
                style={{...this.getImageSize(item)}}
                className={['gallery-item-hover', s.imageWrapper].join(' ')}
              ><img 
                src={this.resizeUrl({ item })} 
                loading="lazy" 
                className={['gallery-item-content', s.image].join(' ')}
                alt={get(item, 'title')} 
                style={this.createItemStyle()}
                // onClick={() => this.props.eventsListener(EVENTS.ITEM_ACTION_TRIGGERED, new GalleryItem({dto: item}))}
              /></div>
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
*/
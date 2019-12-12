import React from 'react';
import GalleryItem from '../item/galleryItem';

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
      itemStyle: {
      }
    };
  }

  resizeUrl({ item }) {

    const { options, resizeMediaUrl } = this.props;

    const { url } = item;
    const method = options.cubeType;
    const isPreload = !(this.state.itemStyle.width > 0)
    if (isPreload) {

    }
    const width = this.state.itemStyle.width || 250;
    const height = this.state.itemStyle.height || 250;
    const focalPoint = false;

    if (typeof resizeMediaUrl === 'function') {
      try {
        return resizeMediaUrl({
          maxWidth: get(item, 'width'),
          maxHeight: get(item, 'height'),
        }, url, method, width, height, false, false, focalPoint) || '';
      } catch (e) {
        return String(url);
      }
    } else {
      return String(url);
    }
  };

  createGalleryStyle() {
    const { options } = this.props;
    const { gridStyle, numberOfImagesPerRow, imageMargin, gallerySizePx } = options;
    const itemSize = Math.min(gallerySizePx, window.innerWidth);
    const gridTemplateColumns = gridStyle === 1 ? `repeat(${numberOfImagesPerRow}, 1fr)` : `repeat(auto-fit, minmax(${itemSize}px, 1fr))`;

    return {
      display: 'grid',
      gridTemplateColumns,
      gridGap: `${imageMargin}px`
    };

  }

  createItemStyle() {
    const { options } = this.props;
    const { 
      cubeType,
      itemBorderWidth: borderWidth,
      itemBorderColor: borderColor,
      itemBorderRadius: borderRadius
    } = options;

    return {
      ...this.state.itemStyle,
      objectFit: cubeType === 'fit' ? 'contain' : 'cover',
      borderWidth,
      borderColor,
      borderRadius
    }
  }

  measure(node) {
    const { options } = this.props;
    node && !this.state.itemStyle.width &&
      this.setState({
        itemStyle: {
          width: node.clientWidth,
          height: Math.round(node.clientWidth / options.cubeRatio),
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
                style={this.state.itemStyle}
                onClick={() => this.props.eventsListener('ITEM_ACTION_TRIGGERED', new GalleryItem(item))}
              />
            </div>
          )
        })
        }
      </div >
    )
  }
}

//http://localhost:3000/?cubeRatio=1.2&imageMargin=50&galleryLayout=13&gallerySizePx=55

/* 
todo: 
  itemClick
  links
  Events
  Texts
  auto render by styleParams
 */
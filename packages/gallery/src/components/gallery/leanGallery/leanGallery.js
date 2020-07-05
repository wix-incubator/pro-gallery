import React from 'react';
// import GalleryItem from '../item/galleryItem';

import EVENTS from '../../../common/constants/events';
import GALLERY_SIZE_TYPE from '../../../common/constants/gallerySizeType';
import CROP_TYPES from '../../../common/constants/resizeMethods'
import {hasVerticalPlacement, default as INFO_PLACEMENT} from '../../../common/constants/placements'

import CLICK_ACTIONS from '../../../common/constants/itemClick'

import { isSEOMode } from '../../../common/window/viewModeWrapper';
import {getInnerInfoStyle} from '../../item/itemViewStyleProvider';

import './leanGallery.scss';

const get = (item, attr) => {
  if (typeof item[attr] !== 'undefined') {
    return item[attr]
  }
  if (typeof item.metadata !== 'undefined') {
    if (typeof item.metadata[attr] !== 'undefined') {
      return item.metadata[attr]
    }
  }
}
export default class LeanGallery extends React.Component {

  constructor() {
    super();

    this.measureIfNeeded = this.measureIfNeeded.bind(this);
    this.eventsListener = this.eventsListener.bind(this);

    this.state = {
      itemStyle: {}
    };
  }

  eventsListener(eventName, eventData) {
    if (typeof this.props.eventsListener === 'function') {
      this.props.eventsListener(eventName, eventData);
    }
  }

  componentDidMount() {
    this.eventsListener(EVENTS.APP_LOADED, {});
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
      itemSize = gallerySize;
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

  createItemStyle(imageSize) {
    const { styles } = this.props;
    const {width, height} = imageSize;
    const {
      itemBorderWidth: borderWidth,
      itemBorderColor: borderColor,
      itemBorderRadius: borderRadius
    } = styles;

    return {
      width,
      height,
      borderWidth,
      borderColor,
      borderRadius
    }
  }

  calcImageSize(image) {
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

  calcContainerHeight() {
    const { height = 0 } = this.state.itemStyle
    const { textBoxHeight = 0, titlePlacement } = this.props.styles;

    if (hasVerticalPlacement(titlePlacement)) {
      return height + textBoxHeight;
    } else {
      return height;
    }
  }

  createLinkParams(item) {
    const { noFollowForSEO, styles } = this.props;
    const { itemClick } = styles;

    const { directLink } = item;
    const { url, target } = directLink || {};
    const isSEO = isSEOMode();
    const shouldUseNofollow = isSEO && noFollowForSEO;
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const shouldUseDirectLink = !!(url && target && itemClick === CLICK_ACTIONS.LINK);
    const linkParams = shouldUseDirectLink
      ? { href: url, target, ...seoLinkParams }
      : false;
    return linkParams;
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

  fixStylesIfNeeded(styles) {
    return {
      ...styles,
      externalInfoHeight: styles.textBoxHeight
    }
  }

  componentDidUpdate() {
    this.measureIfNeeded();
  }

  render() {
    const { eventsListener, props } = this;

    const { customInfoRenderer, items } = props;

    const styles = this.fixStylesIfNeeded(props.styles);

    const { itemClick } = styles;

    return (
      <div
        className={['pro-gallery', 'inline-styles', 'lean-gallery-gallery'].join(' ')}
        style={this.createGalleryStyle()}
      >
        {items.map((item, itemIdx) => {
          const linkParams = this.createLinkParams(item);
          const clickable = (linkParams && itemClick === CLICK_ACTIONS.LINK) || ([CLICK_ACTIONS.EXPAND, CLICK_ACTIONS.FULLSCREEN].includes(itemClick));
          const imageSize = this.calcImageSize(item);
          const itemData = {...item, id: item.itemId, idx: itemIdx};
          const itemProps = {...itemData, ...item.metaData, style: this.state.itemStyle, styleParams: styles};
          const texts = placement => (typeof customInfoRenderer === 'function') && (styles.titlePlacement === placement) && (
            <div className={`gallery-item-common-info gallery-item-${placement === INFO_PLACEMENT.SHOW_ABOVE ? `top` : `bottom`}-info`} style={getInnerInfoStyle(placement, styles)} >{customInfoRenderer(itemProps, placement)}</div>
          );
          return (
            <a
              className={['gallery-item-container', 'lean-gallery-cell'].join(' ')}
              style={{height: this.calcContainerHeight(), cursor: clickable ? 'pointer' : 'default'}}
              ref={node => {
                this.measureIfNeeded(node);
                eventsListener(EVENTS.ITEM_CREATED, itemData);
              }}
              key={'item-container-' + itemIdx}
              {...linkParams}
              >{texts(INFO_PLACEMENT.SHOW_ABOVE)}
              <div
                style={imageSize}
                className={['gallery-item-hover', 'lean-gallery-image-wrapper'].join(' ')}
                onClick={() => eventsListener(EVENTS.ITEM_ACTION_TRIGGERED, itemData)}
              ><img
                src={this.resizeUrl({ item })}
                loading="lazy"
                className={['gallery-item-content', 'lean-gallery-image'].join(' ')}
                alt={get(item, 'title')}
                style={this.createItemStyle(imageSize)}
                onLoad={() => eventsListener(EVENTS.ITEM_LOADED, itemData)}
              /></div>
              {texts(INFO_PLACEMENT.SHOW_BELOW)}
            </a>
          )
        })
        }
      </div >
    )
  }
}

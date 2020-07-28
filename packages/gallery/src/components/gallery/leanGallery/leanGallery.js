import React from 'react';
import { GALLERY_CONSTS, processLayouts, addPresetStyles, isSEOMode } from 'pro-gallery-lib';
import {getInnerInfoStyle} from '../../item/itemViewStyleProvider';
import './leanGallery.scss';

const get = (item, attr) => {
  if (typeof item[attr] !== 'undefined') {
    return item[attr]
  }

  const metadata = item.metadata || item.metaData;
  if (typeof metadata !== 'undefined') {
    if (typeof metadata[attr] !== 'undefined') {
      return metadata[attr]
    }
  }
}

export const formatLeanGalleryStyles = (styles) => {
	return processLayouts(addPresetStyles(styles)); // TODO make sure the processLayouts is up to date. delete addLayoutStyles from layoutsHelper when done with it...
};

export default class LeanGallery extends React.Component {
  constructor() {
    super();

    this.measureIfNeeded = this.measureIfNeeded.bind(this);
    this.eventsListener = this.eventsListener.bind(this);

    this.state = {
      itemStyle: {},
      numberOfColumns: 0
    };
  }

  eventsListener(eventName, eventData) {
    if (typeof this.props.eventsListener === 'function') {
      this.props.eventsListener(eventName, eventData);
    }
  }

  componentDidMount() {
    this.eventsListener(GALLERY_CONSTS.events.APP_LOADED, {});
  }

  resizeUrl({ item }) {
    const { styles, resizeMediaUrl } = this.props;
    const { cubeType, imageQuality, cubeRatio } = styles;
    const { itemStyle } = this.state;

    const { url, mediaUrl, src } = item;
    const itemUrl = url || mediaUrl || src;

    const itemSize = this.calcItemSize();
    const width = itemStyle.width || itemSize;
    const height = itemStyle.height || (itemSize / cubeRatio);

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

    if (gallerySizeType === GALLERY_CONSTS.gallerySizeType.PIXELS && gallerySizePx > 0) {
      itemSize = gallerySizePx;
    } else if (gallerySizeType === GALLERY_CONSTS.gallerySizeType.RATIO && gallerySizeRatio > 0) {
      itemSize = container.width * (gallerySizeRatio / 100);
    } else {
      itemSize = gallerySize;
    }

    return container.width > 0 ? Math.min(itemSize, container.width) : itemSize;
  }

  createGalleryStyle() {
    const { styles } = this.props;
    const { gridStyle, numberOfImagesPerRow, imageMargin } = styles;

    const itemSize = this.calcItemSize();
    const numberOfColumns = gridStyle === GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW ? numberOfImagesPerRow : this.state.numberOfColumns;
    const gridTemplateColumns = numberOfColumns > 0 ? `repeat(${numberOfColumns}, 1fr)` : `repeat(auto-fit, minmax(${itemSize}px, 1fr))`;

    return {
      gridTemplateColumns,
      gridGap: `${imageMargin}px`
    };
  }

  calcNumberOfColumns() {
    const { galleryWidth } = this.props.container;
    if(!galleryWidth) {
      return 0;
    }

    const gallerySize = this.calcItemSize();
    let numOfCols = 1;
    if (this.props.styles.fixedColumns > 0) {
      numOfCols = this.props.styles.fixedColumns;
    } else {
      // find the number of columns that makes each column width the closet to the gallerySize
      const numOfColsFloat = galleryWidth / gallerySize;
      const roundFuncs = [Math.floor, Math.ceil];
      const diffs = roundFuncs
        .map(func => func(numOfColsFloat)) //round to top, round to bottom
        .map(n => Math.round(galleryWidth / n)) //width of each col
        .map(w => Math.abs(gallerySize - w)); //diff from gallerySize
      const roundFunc = roundFuncs[diffs.indexOf(Math.min(...diffs))]; //choose the round function that has the lowest diff from the gallerySize
      numOfCols = roundFunc(numOfColsFloat) || 1;
    }
    
    return numOfCols;
  }

  createImageStyle(imageSize) {
    const { width = '100%', height = 'auto' } = imageSize;
    const { styles } = this.props;
    let borderStyle;

    if(styles.imageInfoType !== GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) {
      borderStyle = {
        borderStyle: 'solid',
        borderWidth: styles.itemBorderWidth,
        borderColor: styles.itemBorderColor.value,
        borderRadius: styles.itemBorderRadius,
        boxSizing: 'border-box'
      }
    }

    return {
      width,
      height,
      ...borderStyle
    }
  }

  createItemBorder() {
    // Set border of the entire Item - including the info text
    const { styles } = this.props;

    if(styles.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) {
      return {
        borderStyle: 'solid',
        borderWidth: styles.itemBorderWidth,
        borderColor: styles.itemBorderColor.value,
        borderRadius: styles.itemBorderRadius
      };
    }
  }

  calcImageSize(image) {
    const { styles } = this.props;
    if (this.state.itemStyle.width && styles.cubeType !== GALLERY_CONSTS.resizeMethods.FIT) {
      return this.state.itemStyle
    } else if (!(this.state.itemStyle.width > 0)) {
      return {
        width: '100%',
        height: 'auto',
      }
    }

    const {width, height} = this.state.itemStyle;
    const imageWidth = get(image, 'width');
    const imageHeight = get(image, 'height');
    const imageRatio = imageWidth / imageHeight;
    const containerRatio = width / height;

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
    let { height = null } = this.state.itemStyle
    const { textBoxHeight = 0, titlePlacement, cubeRatio } = this.props.styles;

    if (height === null) {
      const itemSize = this.calcItemSize();
      height = itemSize / cubeRatio;
      return 'auto';
    }

    if (GALLERY_CONSTS.hasVerticalPlacement(titlePlacement)) {
      return height + textBoxHeight;
    } else {
      return height;
    }
  }

  createContainerStyles(clickable) {
    const { height = null } = this.state.itemStyle;

    return {
      ...this.createItemBorder(),
      ...(height ? {height: this.calcContainerHeight()} : {height: 'auto', textAlign: 'center'}),
      cursor: clickable ? 'pointer' : 'default'
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
    const shouldUseDirectLink = !!(url && target && itemClick === GALLERY_CONSTS.itemClick.LINK);
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

  componentDidUpdate(prevProps) {
    this.measureIfNeeded();

    if (this.props.container.galleryWidth !== prevProps.container.galleryWidth) {
      this.setState({
        numberOfColumns: this.calcNumberOfColumns()
      });
    }
  }

  isMetadataLinkExists(item) {
    const metadata = item.metadata || item.metaData;
    return (metadata && metadata.link) ? true : false;
  }

  render() {
    const { eventsListener, props } = this;
    const { customInfoRenderer, items } = props;
    const styles = this.fixStylesIfNeeded(props.styles);
    const { itemClick } = styles;

    return (
      <div
        data-hook="lean-gallery"
        className={['pro-gallery', 'inline-styles', 'lean-gallery-gallery'].join(' ')}
        style={this.createGalleryStyle()}
      >
        {items.map((item, itemIdx) => {
          const linkParams = this.createLinkParams(item);
          const clickable = (linkParams && itemClick === GALLERY_CONSTS.itemClick.LINK) || ([GALLERY_CONSTS.itemClick.EXPAND, GALLERY_CONSTS.itemClick.FULLSCREEN].includes(itemClick)) || this.isMetadataLinkExists(item);
          const imageSize = this.calcImageSize(item);
          const itemData = {...item, id: item.itemId, idx: itemIdx};
          const itemProps = {...itemData, ...item.metaData, style: this.state.itemStyle, styleParams: styles};

          const texts = placement => (typeof customInfoRenderer === 'function') && (styles.titlePlacement === placement) && (
            <div className={`gallery-item-common-info gallery-item-${placement === GALLERY_CONSTS.placements.SHOW_ABOVE ? `top` : `bottom`}-info`} style={getInnerInfoStyle(placement, styles)} >{customInfoRenderer(itemProps, placement)}</div>
          );

          return (
            <a
              className={['gallery-item-container', 'lean-gallery-cell'].join(' ')}
              style={this.createContainerStyles(clickable)}
              ref={node => {
                this.measureIfNeeded(node);
                eventsListener(GALLERY_CONSTS.events.ITEM_CREATED, itemData);
              }}
              key={'item-container-' + itemIdx}
              {...linkParams}
              >{texts(GALLERY_CONSTS.placements.SHOW_ABOVE)}
              <div
                style={imageSize}
                className={['gallery-item-hover', 'lean-gallery-image-wrapper'].join(' ')}
                onClick={() => eventsListener(GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED, itemData)}
              ><img
                src={this.resizeUrl({ item })}
                loading="lazy"
                className={['gallery-item-content', 'lean-gallery-image'].join(' ')}
                alt={get(item, 'title')}
                style={this.createImageStyle(imageSize)}
                onLoad={() => eventsListener(GALLERY_CONSTS.events.ITEM_LOADED, itemData)}
              /></div>
              {texts(GALLERY_CONSTS.placements.SHOW_BELOW)}
            </a>
          )
        })
        }
      </div >
    )
  }
}

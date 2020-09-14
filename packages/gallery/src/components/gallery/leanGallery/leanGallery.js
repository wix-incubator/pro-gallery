import React from 'react';
import { GALLERY_CONSTS, processLayouts, addPresetStyles, isSEOMode , utils} from 'pro-gallery-lib';
import {getInnerInfoStyle} from '../../item/itemViewStyleProvider';
import './leanGallery.scss';

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

  // #region Lifecycle functions
  componentDidMount() {
    this.eventsListener(GALLERY_CONSTS.events.APP_LOADED, {});
    this.measureIfNeeded();
    this.setState({
      numberOfColumns: this.calcNumberOfColumns(this.props)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container.galleryWidth !== nextProps.container.galleryWidth) {
      this.measureIfNeeded();
      this.setState({
        numberOfColumns: this.calcNumberOfColumns(nextProps)
      });
    }
  }
  // #endregion

  // #region Gallery
  createGalleryStyle() {
    const { gridStyle, fixedColumns, imageMargin, cubeImages } = this.props.styles;

    const itemSize = this.calcItemContainerSize();
    const numberOfColumns = gridStyle === GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW ? fixedColumns : this.state.numberOfColumns;
    const gridTemplateColumns = numberOfColumns > 0 ? `repeat(${numberOfColumns}, 1fr)` : `repeat(auto-fit, minmax(${itemSize.width}px, 1fr))`;

    return {
      gridTemplateColumns,
      gridGap: `${imageMargin}px`,
      ...(cubeImages === false ? {
        gridAutoRows: 'minmax(max-content, 1px)',
        gridGap: 0,
        columnGap: `${imageMargin}px`,
      } : {})
    };
  }

  calcNumberOfColumns(props) {
    const { galleryWidth } = props.container;

    if(!galleryWidth) {
      return 0;
    }

    const itemSize = this.calcItemContainerSize(undefined, props);
    let numOfCols = 1;
    if (props.styles.fixedColumns > 0) {
      numOfCols = props.styles.fixedColumns;
    } else {
      // find the number of columns that makes each column width the closet to the itemSize
      const numOfColsFloat = galleryWidth / itemSize.width;
      const roundFuncs = [Math.floor, Math.ceil];
      const diffs = roundFuncs
        .map(func => func(numOfColsFloat)) //round to top, round to bottom
        .map(n => Math.round(galleryWidth / n)) //width of each col
        .map(w => Math.abs(itemSize.width - w)); //diff from itemSize
      const roundFunc = roundFuncs[diffs.indexOf(Math.min(...diffs))]; //choose the round function that has the lowest diff from the itemSize
      numOfCols = roundFunc(numOfColsFloat) || 1;
    }
    
    return numOfCols;
  }
  // #endregion

  // #region Item container
  calcItemContainerSize(item, props) {
    const { styles, container } = props || this.props;
    const { targetItemSize, cubeImages, titlePlacement, textBoxHeight, cubeRatio, imageMargin } = styles;

    const itemWidth = container.width > 0 ? Math.min(targetItemSize, container.width) : targetItemSize;
    let itemHeight = itemWidth / cubeRatio;

    if (item && cubeImages === false) {
      const ratio = get(item, 'width') / get(item, 'height');
      itemHeight = Math.round((itemWidth - imageMargin) / ratio);
    }

    if (GALLERY_CONSTS.hasVerticalPlacement(titlePlacement)) {
      itemHeight += textBoxHeight;
    }

    return {
      width: itemWidth,
      height: itemHeight
    }
  }

  createItemContainerStyle(clickable, item) {
    const { height = null } = this.state.itemStyle;

    const { imageMargin, cubeImages } = this.props.styles;

    const itemSize = this.calcItemContainerSize(item);

    const noCropStyle = cubeImages === false ? {
      gridRowEnd: `span ${itemSize.height}`,
      marginBottom: `${imageMargin}px`,
      height: 'fit-content',
    } : {};

    return {
      ...this.createItemContainerBorder(),
      ...(height ? {height: 'auto'} : {height: 'auto', textAlign: 'center'}),
      cursor: clickable ? 'pointer' : 'default',
      ...noCropStyle,
    }
  }
  
  createItemContainerBorder() {
    // Set border of the entire Item - including the info text
    const { styles } = this.props;

    if(styles.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) {
      return {
        borderStyle: 'solid',
        borderWidth: styles.itemBorderWidth,
        borderColor: utils.formatColor(styles.itemBorderColor),
        borderRadius: styles.itemBorderRadius
      };
    }
  }
  // #endregion

  // #region Image wrapper
  createImageWrapperStyle(item) {
    const { cubeType, cubeImages } = this.props.styles;

    if (this.state.itemStyle.width && cubeType !== GALLERY_CONSTS.resizeMethods.FIT) {
      const itemSize = this.calcItemContainerSize(item);
      return  cubeImages === false ? {...itemSize} : {...this.state.itemStyle};
    } else if (!(this.state.itemStyle.width > 0)) {
      return {
        width: '100%',
        height: 'auto',
      }
    }

    const {width, height} = this.state.itemStyle;

    const imageWidth = get(item, 'width');
    const imageHeight = get(item, 'height');
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
  // #endregion

  // #region Image
  resizeUrl({ item }) {
    const { styles, resizeMediaUrl } = this.props;
    const { cubeType, imageQuality, cubeRatio, cubeImages } = styles;
    const { itemStyle } = this.state;

    const { url, mediaUrl, src } = item;
    const itemUrl = url || mediaUrl || src;

    const itemSize = this.calcItemContainerSize(item);

    const width = (cubeImages === true && itemStyle.width) || itemSize.width;
    const height = (cubeImages === true && itemStyle.height) || (itemSize.height / cubeRatio);

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

  createImageStyle(imageWrapperStyle) {
    const { width = '100%', height = 'auto' } = imageWrapperStyle;
    const blockDownloadStyles = utils.isiOS() && !this.props.styles.allowContextMenu ? {'-webkit-user-select': 'none',
    '-webkit-touch-callout': 'none'} : {};
    return {
      width,
      height,
      ...blockDownloadStyles,
      ...this.createImageBorder()
    }
  }

  createImageBorder() {
    const { styles } = this.props;

    if(styles.imageInfoType !== GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) {
      return {
        boxSizing: 'border-box',
        borderStyle: 'solid',
        borderWidth: styles.itemBorderWidth,
        borderColor: utils.formatColor(styles.itemBorderColor),
        borderRadius: styles.itemBorderRadius,
      }
    }
  }
  // #endregion

  // #region Helper functions
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

  isMetadataLinkExists(item) {
    const metadata = item.metadata || item.metaData;
    return (metadata && metadata.link) ? true : false;
  }

  eventsListener(eventName, eventData) {
    if (typeof this.props.eventsListener === 'function') {
      this.props.eventsListener(eventName, eventData);
    }
  }
  // #endregion

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
          const itemData = {...item, id: item.itemId, idx: itemIdx};
          const metadata = item.metaData || item.metadata;
          const itemProps = {...itemData, ...metadata, style: this.state.itemStyle, styleParams: styles};
          const imageWrapperStyle = this.createImageWrapperStyle(item);
          const infoHeight = styles.textBoxHeight;
          const texts = placement => (typeof customInfoRenderer === 'function') && (styles.titlePlacement === placement) && (
            <div className={`gallery-item-common-info gallery-item-${placement === GALLERY_CONSTS.placements.SHOW_ABOVE ? `top` : `bottom`}-info`} style={getInnerInfoStyle(placement, styles, infoHeight)} >{customInfoRenderer(itemProps, placement)}</div>
          );

          return (
            <a
              className={['gallery-item-container', 'lean-gallery-cell'].join(' ')}
              style={this.createItemContainerStyle(clickable, item)}
              ref={node => {
                this.measureIfNeeded(node);
                eventsListener(GALLERY_CONSTS.events.ITEM_CREATED, itemData);
              }}
              key={'item-container-' + itemIdx}
              {...linkParams}
              >{texts(GALLERY_CONSTS.placements.SHOW_ABOVE)}
              <div
                style={imageWrapperStyle}
                className={['gallery-item-hover', 'lean-gallery-image-wrapper'].join(' ')}
                onClick={() => eventsListener(GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED, itemData)}
              ><img
                src={this.resizeUrl({ item })}
                loading="lazy"
                className={['gallery-item-content', 'lean-gallery-image'].join(' ')}
                alt={get(item, 'title')}
                style={this.createImageStyle(imageWrapperStyle)}
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


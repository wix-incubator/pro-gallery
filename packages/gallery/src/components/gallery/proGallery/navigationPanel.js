import React from 'react';
import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';

import TextItem from '../../item/textItem.js';

import { thumbnailsLogic } from 'pro-gallery-lib';

const ENTER_KEY = 'Enter';

class NavigationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
  }

  scrollToThumbnail(itemIdx) {
    this.props.navigationToIdxCB(itemIdx);
  }

  createThumbnails({
    navigationPanelPosition,
    thumbnailAlignment,
    options,
    galleryStructure,
    settings,
  }) {
    const clearedGalleryItems = thumbnailsLogic.clearGalleryItems(
      this.props.items,
      this.props.galleryStructure.galleryItems
    );
    const activeIndex = utils.inRange(
      this.props.activeIndex,
      clearedGalleryItems.length
    );
    const { thumbnailSize, thumbnailSpacings } = options;
    const {
      horizontalThumbnails,
      items,
      thumbnailsMargins,
      thumbnailsStyle,
      activeIndexOffsetMemory,
    } = thumbnailsLogic.getThumbnailsData({
      items: this.props.items,
      activeIndex,
      options,
      galleryStructure,
      thumbnailAlignment,
      containerHeight: this.props.container.height,
      containerWidth: this.props.container.width,
      activeIndexOffsetMemory: this.activeIndexOffsetMemory,
      prevActiveIndex: this.prevActiveIndex,
    });

    this.prevActiveIndex = activeIndex;
    this.activeIndexOffsetMemory = activeIndexOffsetMemory;

    return (
      <div
        className={
          'pro-gallery inline-styles thumbnails-gallery ' +
          (horizontalThumbnails ? ' one-row hide-scrollbars ' : '') +
          (options.isRTL ? ' rtl ' : ' ltr ') +
          (settings?.isAccessible ? ' accessible ' : '')
        }
        style={{
          width: thumbnailsStyle.width,
          height: thumbnailsStyle.height,
          ...thumbnailsMargins,
          ...getNavigationPanelOnGalleryPositionStyles({
            galleryThumbnailsAlignment: thumbnailAlignment,
            navigationPanelPosition,
          }),
        }}
        data-hook="gallery-thumbnails"
      >
        <div
          data-hook="gallery-thumbnails-column"
          className={'galleryColumn'}
          key={'thumbnails-column'}
          style={{ ...thumbnailsStyle }}
        >
          {items.map(({ thumbnailItem, location, idx }) => {
            const highlighted = idx === activeIndex;
            const itemStyle = {
              width: thumbnailSize,
              height: thumbnailSize,
              marginLeft: thumbnailSpacings,
              marginTop: thumbnailSpacings,
              overflow: 'hidden',
              backgroundImage: `url(${thumbnailItem.createUrl(
                GALLERY_CONSTS.urlSizes.THUMBNAIL,
                GALLERY_CONSTS.urlTypes.HIGH_RES
              )})`,
              ...location,
            };
            return (
              <div
                key={
                  'thumbnail-' +
                  thumbnailItem.id +
                  (Number.isInteger(idx) ? '-' + idx : '')
                }
                className={
                  'thumbnailItem' +
                  (highlighted
                    ? ' pro-gallery-thumbnails-highlighted pro-gallery-highlight' +
                      (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
                    : '')
                }
                data-key={thumbnailItem.id}
                style={itemStyle}
                onClick={() => this.scrollToThumbnail(idx)}
                onKeyDown={(e) => {
                  if (e.key === ENTER_KEY) {
                    this.scrollToThumbnail(idx);
                  }
                }}
              >
                {thumbnailItem.type === 'text' ? (
                  <TextItem
                    {...this.props}
                    {...thumbnailItem.renderProps()}
                    options={{
                      ...options,
                      cubeType: 'fill',
                      cubeImages: true,
                    }}
                    actions={{}}
                    imageDimensions={{
                      ...itemStyle,
                      marginTop: 0,
                      marginLeft: 0,
                    }}
                    style={{
                      ...thumbnailItem.renderProps().style,
                      ...itemStyle,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    const { position: navigationPanelPosition } =
      this.props.options.layoutParams.thumbnails;
    const navigationRelevantProps = {
      navigationPanelPosition,
      thumbnailAlignment: this.props.options.galleryThumbnailsAlignment,
      options: this.props.options,
      galleryStructure: this.props.galleryStructure,
      settings: this.props.settings,
    };

    return this.createThumbnails(navigationRelevantProps);
  }
}

const getHorizontalNavigationPanelDimensions = ({
  width,
  height,
  galleryHeight,
  navigationPanelPosition,
}) => {
  if (navigationPanelPosition === 'ON_GALLERY') {
    return {};
  } else {
    return { width: width, height: height - galleryHeight };
  }
};
const getVerticalNavigationPanelDimensions = ({
  width,
  height,
  galleryWidth,
  navigationPanelPosition,
}) => {
  if (navigationPanelPosition === 'ON_GALLERY') {
    return {};
  } else {
    return { width: width - galleryWidth, height: height };
  }
};
const getCustomNavigationPanelDimensions = ({
  galleryHeight,
  galleryWidth,
  height,
  width,
  galleryThumbnailsAlignment,
  navigationPanelPosition,
}) => {
  switch (galleryThumbnailsAlignment) {
    case 'top': //TODO use CONSTS if available
      return getHorizontalNavigationPanelDimensions(
        { galleryHeight, galleryWidth, height, width, navigationPanelPosition },
        false
      );
    case 'bottom':
      return getHorizontalNavigationPanelDimensions(
        { galleryHeight, galleryWidth, height, width, navigationPanelPosition },
        true
      );
    case 'right':
    case 'left':
      return getVerticalNavigationPanelDimensions({
        galleryHeight,
        galleryWidth,
        height,
        width,
        navigationPanelPosition,
      });
    default:
      return false;
  }
};

export const getCustomNavigationPanelInlineStyles = ({
  galleryHeight,
  galleryWidth,
  height,
  width,
  galleryThumbnailsAlignment,
  navigationPanelPosition,
}) => {
  return {
    ...getCustomNavigationPanelDimensions({
      galleryHeight,
      galleryWidth,
      height,
      width,
      galleryThumbnailsAlignment,
      navigationPanelPosition,
    }),
    ...getNavigationPanelOnGalleryPositionStyles({
      galleryThumbnailsAlignment,
      navigationPanelPosition,
    }),
    overflow: 'hidden',
    float: 'left',
  };
};

const getNavigationPanelOnGalleryPositionStyles = ({
  galleryThumbnailsAlignment,
  navigationPanelPosition,
}) => {
  if (
    navigationPanelPosition === GALLERY_CONSTS.thumbnailsPosition.ON_GALLERY
  ) {
    let onGalleryStyles = { position: 'absolute' };
    onGalleryStyles[galleryThumbnailsAlignment] = 0;
    return onGalleryStyles;
  }
};

export default NavigationPanel;

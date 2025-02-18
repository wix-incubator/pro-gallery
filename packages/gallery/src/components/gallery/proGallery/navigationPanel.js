import React from 'react';
import { GALLERY_CONSTS, optionsMap, utils, thumbnailsLogic } from 'pro-gallery-lib';
import { GalleryUI } from '../../item/media/GalleryUI.js';

import TextItem from '../../item/textItem.js';

const ENTER_KEY = 'Enter';

class NavigationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
  }

  scrollToThumbnail(itemIdx) {
    this.props.navigationToIdxCB(itemIdx);
  }

  createThumbnails({ navigationPanelPosition, thumbnailAlignment, options, galleryStructure, settings }) {
    const clearedGalleryItems = thumbnailsLogic.clearGalleryItems(
      this.props.items,
      this.props.galleryStructure.galleryItems
    );
    const activeIndex = utils.inRange(this.props.activeIndex, clearedGalleryItems.length);

    const { horizontalThumbnails, items, thumbnailsMargins, thumbnailsStyle, activeIndexOffsetMemory } =
      thumbnailsLogic.getThumbnailsData({
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
          (this.props.domOrder ? 'thumbnails-gallery-' + this.props.domOrder : '') +
          (horizontalThumbnails ? ' one-row hide-scrollbars ' : '') +
          (options[optionsMap.behaviourParams.gallery.layoutDirection] ===
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
            ? ' rtl '
            : ' ltr ') +
          (settings?.isAccessible ? ' accessible ' : '')
        }
        style={{
          ...(this.props.isPrerenderMode ? { display: 'block' } : {}),
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
            const highlighted = idx === activeIndex % clearedGalleryItems.length;
            const itemStyle = {
              width: options[optionsMap.layoutParams.thumbnails.size],
              height: options[optionsMap.layoutParams.thumbnails.size],
              overflow: 'hidden',
              backgroundImage: `url(${thumbnailItem.createUrl(
                GALLERY_CONSTS.urlSizes.THUMBNAIL,
                GALLERY_CONSTS.urlTypes.HIGH_RES
              )})`,
              ...location,
              ...(this.props.isPrerenderMode ? { opacity: 0 } : {}),
            };
            return (
              <div
                key={'thumbnail-' + thumbnailItem.id + (Number.isInteger(idx) ? '-' + idx : '')}
                className={
                  'thumbnailItem ' +
                  'thumbnail-' +
                  thumbnailItem.idx +
                  (highlighted
                    ? ' pro-gallery-thumbnails-highlighted pro-gallery-highlight' +
                      (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
                    : '')
                }
                data-key={thumbnailItem.id}
                style={itemStyle}
                onClick={() => this.scrollToThumbnail(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ENTER_KEY) {
                    this.scrollToThumbnail(idx);
                  }
                }}
              >
                {thumbnailItem.type === 'video' &&
                  options[optionsMap.behaviourParams.item.video.enableThumbnailsPlayButton] && (
                    <GalleryUI type={'videoPlayButton'} size={'28'} />
                  )}
                {thumbnailItem.type === '3d' &&
                  options[optionsMap.behaviourParams.item.threeDimensionalScene.enableThumbnailsPlayButton] && (
                    <GalleryUI type={'rotateArrow'} size={'28'} />
                  )}

                {thumbnailItem.type === 'text' ? (
                  <TextItem
                    {...this.props}
                    {...thumbnailItem.renderProps()}
                    options={{
                      ...options,
                      [optionsMap.layoutParams.crop.method]: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
                      [optionsMap.layoutParams.crop.enable]: true,
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
    const navigationRelevantProps = {
      navigationPanelPosition: this.props.options[optionsMap.layoutParams.thumbnails.position],
      thumbnailAlignment: this.props.options[optionsMap.layoutParams.thumbnails.alignment],
      options: this.props.options,
      galleryStructure: this.props.galleryStructure,
      settings: this.props.settings,
    };

    return this.createThumbnails(navigationRelevantProps);
  }
}

const getHorizontalNavigationPanelDimensions = ({ width, height, galleryHeight, navigationPanelPosition }) => {
  if (navigationPanelPosition === GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY) {
    return {};
  } else {
    return { width: width, height: height - galleryHeight };
  }
};
const getVerticalNavigationPanelDimensions = ({ width, height, galleryWidth, navigationPanelPosition }) => {
  if (navigationPanelPosition === GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY) {
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
    case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP:
      return getHorizontalNavigationPanelDimensions(
        { galleryHeight, galleryWidth, height, width, navigationPanelPosition },
        false
      );
    case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM:
      return getHorizontalNavigationPanelDimensions(
        { galleryHeight, galleryWidth, height, width, navigationPanelPosition },
        true
      );
    case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT:
    case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT:
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

const getNavigationPanelOnGalleryPositionStyles = ({ galleryThumbnailsAlignment, navigationPanelPosition }) => {
  if (navigationPanelPosition === GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY) {
    let onGalleryStyles = { position: 'absolute' };
    onGalleryStyles[galleryThumbnailsAlignment.toLowerCase()] = 0;
    return onGalleryStyles;
  }
};

export default NavigationPanel;

import React from 'react';
import { GALLERY_CONSTS, isEditMode, utils } from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';

export default class ItemHover extends GalleryComponent {
  getHoverClass() {
    const { styleParams, forceShowHover } = this.props;
    const hoverClass = ['gallery-item-hover'];

    hoverClass.push(
      'fullscreen-' + (styleParams.fullscreen ? 'enabled' : 'disabled')
    );

    if (utils.isUndefined(styleParams.itemOpacity)) {
      //if gallery was just added to the page, and it's settings were never opened,
      //the styles of opacity and background were not set (are undefined),
      //so we are using the default background & opacity (is scss under .gallery-item-hover.default)
      hoverClass.push('default');
    }

    if (forceShowHover) {
      //in mobile, when item is hovered (tapped, with all the right configurations), forceShowHover is true
      hoverClass.push('force-hover');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }

    return hoverClass.join(' ');
  }

  shouldRenderHoverInnerIfExist() {
    const { itemWasHovered, styleParams } = this.props;
    const {
      hoveringBehaviour,
      overlayAnimation,
      alwaysShowHover,
      previewHover,
    } = styleParams;
    const { APPEARS } = GALLERY_CONSTS.infoBehaviourOnHover;
    const { NO_EFFECT } = GALLERY_CONSTS.overlayAnimations;

    if (alwaysShowHover) {
      return true;
    }
    if (isEditMode() && previewHover) {
      return true;
    }
    if (hoveringBehaviour === APPEARS && overlayAnimation !== NO_EFFECT) {
      //when there is a specific overlayAnimation, to support the animation we render the itemHover before any hover activity (see 'shouldHover()' in itemView).
      //so in this specific case, the itemHover exists right away, but we do'nt want to render yet the hover-inner,
      //the hover-inner will be rendered only after (at) the first hover an on, and not before.
      return itemWasHovered;
    }
    return true;
  }

  getOverlayStyle() {
    const { styleParams } = this.props;
    const { overlayPosition } = styleParams;
    const isHorizontal =
      overlayPosition === GALLERY_CONSTS.overlayPositions.LEFT ||
      overlayPosition === GALLERY_CONSTS.overlayPositions.RIGHT ||
      overlayPosition === GALLERY_CONSTS.overlayPositions.CENTERED_HORIZONTALLY;
    if (isHorizontal) {
      return this.calculateHorizontalOverlayStyles();
    }
    return this.calculateVerticalOverlayStyles();
  }

  calculateVerticalOverlayStyles() {
    const { styleParams, imageDimensions } = this.props;
    const { overlayPosition, overlaySize, overlaySizeType } = styleParams;
    const { width, height, marginTop, marginLeft } = imageDimensions;
    let convertHeight =
      overlaySizeType === 'PERCENT'
        ? height * (overlaySize / 100)
        : overlaySize;
    // const convertWidth = overlaySizeType  === 'PERCENT' ? width * (overlaySize/100) : overlaySize;
    let style = {};
    if (convertHeight > height) {
      convertHeight = height;
    }

    switch (overlayPosition) {
      case GALLERY_CONSTS.overlayPositions.TOP:
        style = {
          width,
          height: convertHeight,
          marginTop,
          marginLeft,
        };
        break;
      case GALLERY_CONSTS.overlayPositions.BOTTOM:
        style = {
          width,
          height: convertHeight,
          marginTop: height - convertHeight,
          marginLeft,
        };
        break;
      case GALLERY_CONSTS.overlayPositions.CENTERED_VERTICALLY:
        style = {
          width,
          height: convertHeight,
          marginTop: height / 2 - convertHeight / 2,
          marginLeft,
        };
        break;
    }
    style.maxWidth = width;
    return style;
  }

  calculateHorizontalOverlayStyles() {
    let style = {};
    const { styleParams, imageDimensions } = this.props;
    const { overlayPosition, overlaySize, overlaySizeType } = styleParams;
    const { width, height, marginTop, marginLeft } = imageDimensions;
    // const convertHeight = overlaySizeType  === 'PERCENT' ? height * (overlaySize/100) : overlaySize;
    let convertWidth =
      overlaySizeType === 'PERCENT' ? width * (overlaySize / 100) : overlaySize;

    if (convertWidth > width) {
      convertWidth = width;
    }

    switch (overlayPosition) {
      case GALLERY_CONSTS.overlayPositions.LEFT:
        style = {
          width: convertWidth,
          height,
          marginTop,
          marginLeft,
        };
        break;
      case GALLERY_CONSTS.overlayPositions.RIGHT:
        style = {
          width: convertWidth,
          height,
          marginTop,
          marginLeft: width - convertWidth,
        };
        break;
      case GALLERY_CONSTS.overlayPositions.CENTERED_HORIZONTALLY:
        style = {
          width: convertWidth,
          height,
          marginTop,
          marginLeft: width / 2 - convertWidth / 2,
        };
        break;
      default:
        style = {
          width,
          height,
          marginTop,
          marginLeft,
        };
        break;
    }
    style.maxHeight = height;
    return style;
  }

  render() {
    const { actions, idx, renderCustomInfo } = this.props;
    const hoverClass = this.getHoverClass();
    const overlayStyle = this.getOverlayStyle();
    return (
      <div
        className={hoverClass}
        key={'item-hover-' + idx}
        data-hook={'item-hover-' + idx}
        aria-hidden={true}
        // style={imageDimensions}
        style={overlayStyle}
      >
        <div
          style={{ height: '100%' }}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
        >
          {this.shouldRenderHoverInnerIfExist() && renderCustomInfo ? (
            <div className="gallery-item-hover-inner">{renderCustomInfo()}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

import React from 'react';
import { GALLERY_CONSTS, isEditMode, utils } from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';

export default class ItemHover extends GalleryComponent {
  getHoverClass() {
    const { styleParams, forceShowHover } = this.props;
    const { overlayPosition } = styleParams;
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

    //overlay positions
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.LEFT) {
      hoverClass.push('position-left');
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.BOTTOM) {
      hoverClass.push('position-bottom');
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.TOP) {
      hoverClass.push('position-top');
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.RIGHT) {
      hoverClass.push('position-right');
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
  //to do- isHorizon,isVertical, isTop, isLeft.... separate between height width to top left right bottom
  getStyleByOverlay() {
    const { styleParams, imageDimensions } = this.props;
    const { overlayPosition } = styleParams;
    const { width, height, top, bottom } = imageDimensions;
    let style;
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.LEFT) {
      style = {
        width: 10000 + 'px',
        height: height,
        bottom: top,
        left: bottom,
      };
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.RIGHT) {
      style = { width: width, height: height, bottom: top, left: 100 + 'px' };
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.TOP) {
      style = { width: width, height: 100 + 'px', bottom: top, left: bottom };
    }
    if (overlayPosition === GALLERY_CONSTS.overlayPositions.BOTTOM) {
      style = {
        width: width,
        height: height,
        bottom: 100 + 'px',
        left: bottom,
      };
    }
    return style;
  }

  render() {
    const { actions, idx, renderCustomInfo } = this.props;
    const hoverClass = this.getHoverClass();
    // const { width, height, top, bottom} = imageDimensions;
    const overlayStyle = this.getStyleByOverlay();
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

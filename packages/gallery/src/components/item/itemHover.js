import React from 'react';
import { GALLERY_CONSTS, isEditMode, utils } from 'pro-gallery-lib';

export default class ItemHover extends React.Component {
  getHoverClass() {
    const { options, forceShowHover } = this.props;
    const hoverClass = ['gallery-item-hover'];

    hoverClass.push(
      'fullscreen-' + (options.fullscreen ? 'enabled' : 'disabled')
    );

    if (utils.isUndefined(options.itemOpacity)) {
      //if gallery was just added to the page, and it's settings were never opened,
      //the options of opacity and background were not set (are undefined),
      //so we are using the default background & opacity (is scss under .gallery-item-hover.default)
      hoverClass.push('default');
    }

    if (forceShowHover) {
      //in mobile, when item is hovered (tapped, with all the right configurations), forceShowHover is true
      hoverClass.push('force-hover');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }
    if (this.props.isCurrentHover) {
      hoverClass.push('item-overlay-hover');
    } else {
      hoverClass.push('item-overlay-regular');
    }
    return hoverClass.join(' ');
  }

  shouldRenderHoverInnerIfExist() {
    const { itemWasHovered, options } = this.props;
    const {
      hoveringBehaviour,
      overlayAnimation,
      alwaysShowHover,
      previewHover,
    } = options;
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
    const { options, imageDimensions } = this.props;
    const style = {};
    const {
      overlayPosition,
      overlaySize: requiredOverlaySize,
      overlaySizeType,
      overlayPadding,
    } = options;

    const isHorizontal =
      overlayPosition === GALLERY_CONSTS.overlayPositions.LEFT ||
      overlayPosition === GALLERY_CONSTS.overlayPositions.RIGHT ||
      overlayPosition === GALLERY_CONSTS.overlayPositions.CENTERED_HORIZONTALLY;

    const { width, height } = this.calcHeightAndWidth({
      isHorizontal,
      overlayPadding,
      requiredOverlaySize,
      imageDimensions,
      overlaySizeType,
    });
    const margin = overlayPadding;
    Object.assign(style, {
      width,
      height,
      margin,
      position: 'relative',
    });
    return style;
  }

  calcHeightAndWidth({
    isHorizontal,
    overlayPadding,
    requiredOverlaySize,
    imageDimensions,
    overlaySizeType,
  }) {
    const calculatedField = isHorizontal ? 'width' : 'height';
    const calculatedOppositeField = isHorizontal ? 'height' : 'width';
    const overlaySizeCalc = this.calcOverlaySize(
      imageDimensions[calculatedField],
      requiredOverlaySize,
      overlaySizeType,
      overlayPadding
    );
    return {
      [calculatedField]: overlaySizeCalc,
      [calculatedOppositeField]:
        imageDimensions[calculatedOppositeField] - 2 * overlayPadding,
    };
  }

  calcOverlaySize(
    widthOrHeight,
    requiredOverlaySize,
    overlaySizeType,
    overlayPadding
  ) {
    const widthOrHeightCalc = widthOrHeight + -2 * overlayPadding;
    const overlaySize = Math.min(
      widthOrHeightCalc,
      overlaySizeType === 'PERCENT'
        ? widthOrHeightCalc * (requiredOverlaySize / 100)
        : requiredOverlaySize
    );
    return Math.max(0, overlaySize);
  }

  getOverlayPositionByFlex() {
    const { options, imageDimensions } = this.props;
    const { overlayPosition } = options;
    const { width, height, marginTop, marginLeft } = imageDimensions;
    const style = {
      width,
      height,
      marginTop,
      marginLeft,
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
    };
    switch (overlayPosition) {
      case GALLERY_CONSTS.overlayPositions.RIGHT:
        Object.assign(style, {
          justifyContent: 'flex-end',
        });
        break;
      case GALLERY_CONSTS.overlayPositions.BOTTOM:
        Object.assign(style, {
          alignItems: 'flex-end',
        });
        break;
      case GALLERY_CONSTS.overlayPositions.CENTERED_HORIZONTALLY:
        Object.assign(style, {
          justifyContent: 'center',
        });
        break;
      case GALLERY_CONSTS.overlayPositions.CENTERED_VERTICALLY:
        Object.assign(style, {
          alignItems: 'center',
        });
        break;
    }
    return style;
  }

  render() {
    const { actions, idx, renderCustomInfo } = this.props;
    const hoverClass = this.getHoverClass();
    const overlayStyle = this.getOverlayStyle();
    const overlayPositionCalc = this.getOverlayPositionByFlex();
    return (
      <div className={'item-hover-flex-container'} style={overlayPositionCalc}>
        <div
          key={'item-hover-' + idx}
          data-hook={'item-hover-' + idx}
          className={hoverClass}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          style={overlayStyle}
        >
          {this.shouldRenderHoverInnerIfExist() && renderCustomInfo ? (
            <div className="gallery-item-hover-inner">{renderCustomInfo()}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

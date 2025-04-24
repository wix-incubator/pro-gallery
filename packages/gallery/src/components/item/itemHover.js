import React from 'react';
import { GALLERY_CONSTS, isEditMode, optionsMap, utils } from 'pro-gallery-lib';

export default class ItemHover extends React.Component {
  getHoverClass() {
    const { options, forceShowHover } = this.props;
    const hoverClass = ['gallery-item-hover'];

    hoverClass.push('fullscreen-' + (options.fullscreen ? 'enabled' : 'disabled'));

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
    const { alwaysShowHover, previewHover } = options;
    const { APPEARS } = GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour];
    const { NO_EFFECT } = GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation];

    if (alwaysShowHover) {
      return true;
    }
    if (isEditMode() && previewHover) {
      return true;
    }
    if (
      options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] === APPEARS &&
      options[optionsMap.behaviourParams.item.overlay.hoverAnimation] !== NO_EFFECT
    ) {
      //when there is a specific Overlay Hover Animation, to support the animation we render the itemHover before any hover activity (see 'shouldHover()' in itemView).
      //so in this specific case, the itemHover exists right away, but we do'nt want to render yet the hover-inner,
      //the hover-inner will be rendered only after (at) the first hover an on, and not before.
      return itemWasHovered;
    }
    return true;
  }

  getOverlayStyle() {
    const { options, imageDimensions } = this.props;
    const style = {};
    const overlayPadding = options[optionsMap.behaviourParams.item.overlay.padding];
    const overlaySizeUnits = options[optionsMap.behaviourParams.item.overlay.sizeUnits];
    const requiredOverlaySize = options[optionsMap.behaviourParams.item.overlay.size];
    const overlayPosition = options[optionsMap.behaviourParams.item.overlay.position];
    const { LEFT, RIGHT, CENTERED_HORIZONTALLY } = GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position];
    const isHorizontal =
      overlayPosition === LEFT || overlayPosition === RIGHT || overlayPosition === CENTERED_HORIZONTALLY;

    const { width, height } = this.calcHeightAndWidth({
      isHorizontal,
      overlayPadding,
      requiredOverlaySize,
      imageDimensions,
      overlaySizeUnits,
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

  calcHeightAndWidth({ isHorizontal, overlayPadding, requiredOverlaySize, imageDimensions, overlaySizeUnits }) {
    const calculatedField = isHorizontal ? 'width' : 'height';
    const calculatedOppositeField = isHorizontal ? 'height' : 'width';
    const overlaySizeCalc = this.calcOverlaySize(
      imageDimensions[calculatedField],
      requiredOverlaySize,
      overlaySizeUnits,
      overlayPadding
    );
    return {
      [calculatedField]: overlaySizeCalc,
      [calculatedOppositeField]: imageDimensions[calculatedOppositeField] - 2 * overlayPadding,
    };
  }

  calcOverlaySize(widthOrHeight, requiredOverlaySize, overlaySizeUnits, overlayPadding) {
    const widthOrHeightCalc = widthOrHeight + -2 * overlayPadding;
    const overlaySize = Math.min(
      widthOrHeightCalc,
      overlaySizeUnits === GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PERCENT
        ? widthOrHeightCalc * (requiredOverlaySize / 100)
        : requiredOverlaySize
    );
    return Math.max(0, overlaySize);
  }

  getOverlayPositionByFlex() {
    const { options, imageDimensions } = this.props;
    const overlayPosition = options[optionsMap.behaviourParams.item.overlay.position];
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
    const { RIGHT, BOTTOM, CENTERED_HORIZONTALLY, CENTERED_VERTICALLY } =
      GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position];
    switch (overlayPosition) {
      case RIGHT:
        Object.assign(style, {
          justifyContent: 'flex-end',
        });
        break;
      case BOTTOM:
        Object.assign(style, {
          alignItems: 'flex-end',
        });
        break;
      case CENTERED_HORIZONTALLY:
        Object.assign(style, {
          justifyContent: 'center',
        });
        break;
      case CENTERED_VERTICALLY:
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

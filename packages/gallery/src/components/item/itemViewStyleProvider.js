import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';

export function getContainerStyle(options) {
  return {
    ...((options.imageInfoType ===
      GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      GALLERY_CONSTS.hasHoverPlacement(options.titlePlacement)) && {
      ...getBorderStyle(
        options.itemBorderRadius,
        options.itemBorderWidth,
        options.itemBorderColor
      ),
      ...boxShadow(options),
    }),
  };
}

function boxShadow(options) {
  let _boxShadow = {};
  if (options.itemEnableShadow) {
    const { itemShadowBlur, itemShadowDirection, itemShadowSize } = options;
    const alpha =
      ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
    const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
    const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
    _boxShadow = {
      boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${utils.formatColor(
        options.itemShadowOpacityAndColor
      )}`,
    };
  }
  return _boxShadow;
}

export function getImageStyle(options) {
  return {
    ...(!GALLERY_CONSTS.hasHoverPlacement(options.titlePlacement) &&
      (options.imageInfoType === GALLERY_CONSTS.infoType.NO_BACKGROUND ||
        options.imageInfoType ===
          GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND) && {
        ...getBorderStyle(
          options.itemBorderRadius,
          options.itemBorderWidth,
          options.itemBorderColor
        ),
      }),
  };
}

function getBorderStyle(borderRadius, borderWidth, borderColor) {
  return {
    // overflow: 'hidden',
    ...(borderRadius > 0 && { borderRadius }),
    ...(borderWidth > 0 && {
      borderWidth: borderWidth + 'px',
      borderColor: utils.formatColor(borderColor),
      borderStyle: 'solid',
    }),
  };
}

export function getOuterInfoStyle(
  placement,
  options,
  mediaHeight,
  textBoxHeight
) {
  const styles = {
    ...(GALLERY_CONSTS.hasExternalHorizontalPlacement(placement) && {
      height: mediaHeight,
      float: GALLERY_CONSTS.isExternalRightPlacement(placement)
        ? 'right'
        : 'left',
    }),
    ...(GALLERY_CONSTS.hasExternalVerticalPlacement(placement) && {
      height: textBoxHeight,
      boxSizing: 'content-box',
    }),
  };
  if (options.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND) {
    return {
      ...styles,
      ...getBorderStyle(
        options.textBoxBorderRadius,
        options.textBoxBorderWidth,
        options.textBoxBorderColor
      ),
      ...(GALLERY_CONSTS.hasExternalAbovePlacement(placement) && {
        marginBottom: options.textImageSpace,
      }),
      ...(GALLERY_CONSTS.hasExternalBelowPlacement(placement) && {
        marginTop: options.textImageSpace,
      }),
    };
  }
  return styles;
}

function getInnerInfoStylesAboveOrBelow(options, infoHeight) {
  return {
    width: '100%',
    height: infoHeight,
  };
}

function getInnerInfoStylesRightOrLeft(options, infoWidth) {
  return {
    height: '100%',
    width: infoWidth,
  };
}

export function getInnerInfoStyle(placement, options, infoHeight, infoWidth) {
  const commonStyles = {
    ...((options.imageInfoType ===
      GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND ||
      options.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) &&
      options.textBoxFillColor &&
      options.textBoxFillColor.value && {
        backgroundColor: options.textBoxFillColor.value,
      }),
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const infoAboveOrBelow =
    GALLERY_CONSTS.hasExternalVerticalPlacement(placement);
  const infoRightOrLeft =
    GALLERY_CONSTS.hasExternalHorizontalPlacement(placement);

  return {
    ...commonStyles,
    ...(infoAboveOrBelow &&
      getInnerInfoStylesAboveOrBelow(options, infoHeight)),
    ...(infoRightOrLeft && getInnerInfoStylesRightOrLeft(options, infoWidth)),
  };
}

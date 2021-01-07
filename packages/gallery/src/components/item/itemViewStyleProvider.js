import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';

export function getContainerStyle(styleParams) {
  return {
    ...((styleParams.imageInfoType ===
      GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      GALLERY_CONSTS.hasHoverPlacement(styleParams.titlePlacement)) && {
      ...getBorderStyle(
        styleParams.itemBorderRadius,
        styleParams.itemBorderWidth,
        styleParams.itemBorderColor
      ),
      ...boxShadow(styleParams),
    }),
  };
}

function boxShadow(styleParams) {
  let _boxShadow = {};
  if (styleParams.itemEnableShadow) {
    const { itemShadowBlur, itemShadowDirection, itemShadowSize } = styleParams;
    const alpha =
      ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
    const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
    const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
    _boxShadow = {
      boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${utils.formatColor(
        styleParams.itemShadowOpacityAndColor
      )}`,
    };
  }
  return _boxShadow;
}

export function getImageStyle(styleParams) {
  return {
    ...(!GALLERY_CONSTS.hasHoverPlacement(styleParams.titlePlacement) &&
      (styleParams.imageInfoType === GALLERY_CONSTS.infoType.NO_BACKGROUND ||
        styleParams.imageInfoType ===
          GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND) && {
        ...getBorderStyle(
          styleParams.itemBorderRadius,
          styleParams.itemBorderWidth,
          styleParams.itemBorderColor
        ),
      }),
  };
}

function getBorderStyle(borderRadius, borderWidth, borderColor) {
  return {
    overflow: 'hidden',
    borderRadius: borderRadius,
    borderWidth: borderWidth + 'px',
    borderColor: utils.formatColor(borderColor),
    ...(borderWidth && {
      borderStyle: 'solid',
    }),
  };
}

export function getOuterInfoStyle(
  placement,
  styleParams,
  mediaHeight,
  textBoxHeight
) {
  const styles = {
    ...(GALLERY_CONSTS.hasHorizontalPlacement(placement) && {
      height: mediaHeight,
      float: GALLERY_CONSTS.isRightPlacement(placement) ? 'right' : 'left',
    }),
    ...(GALLERY_CONSTS.hasVerticalPlacement(placement) && {
      height: textBoxHeight,
      boxSizing: 'content-box',
    }),
  };
  if (
    styleParams.imageInfoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND
  ) {
    return {
      ...styles,
      ...getBorderStyle(
        styleParams.textBoxBorderRadius,
        styleParams.textBoxBorderWidth,
        styleParams.textBoxBorderColor
      ),
      ...(GALLERY_CONSTS.hasAbovePlacement(placement) && {
        marginBottom: styleParams.textImageSpace,
      }),
      ...(GALLERY_CONSTS.hasBelowPlacement(placement) && {
        marginTop: styleParams.textImageSpace,
      }),
    };
  }
  return styles;
}

function getInnerInfoStylesAboveOrBelow(styleParams, infoHeight) {
  return {
    width: '100%',
    height: infoHeight,
  };
}

function getInnerInfoStylesRightOrLeft(styleParams, infoWidth) {
  return {
    height: '100%',
    width: infoWidth,
  };
}

export function getInnerInfoStyle({
  placement,
  styleParams,
  infoHeight,
  infoWidth,
  itemHasLink,
}) {
  const commonStyles = {
    ...((styleParams.imageInfoType ===
      GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND ||
      styleParams.imageInfoType ===
        GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND) &&
      styleParams.textBoxFillColor &&
      styleParams.textBoxFillColor.value && {
        backgroundColor: styleParams.textBoxFillColor.value,
      }),
    overflow: 'hidden',
    boxSizing: 'border-box',
    cursor:
      styleParams.itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
      (styleParams.itemClick === GALLERY_CONSTS.itemClick.LINK && !itemHasLink)
        ? 'default'
        : 'pointer',
  };

  const infoAboveOrBelow = GALLERY_CONSTS.hasVerticalPlacement(placement);
  const infoRightOrLeft = GALLERY_CONSTS.hasHorizontalPlacement(placement);

  return {
    ...commonStyles,
    ...(infoAboveOrBelow &&
      getInnerInfoStylesAboveOrBelow(styleParams, infoHeight)),
    ...(infoRightOrLeft &&
      getInnerInfoStylesRightOrLeft(styleParams, infoWidth)),
  };
}

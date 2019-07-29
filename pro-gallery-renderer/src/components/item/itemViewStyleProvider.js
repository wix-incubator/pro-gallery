import INFO_TYPE from '../../utils/constants/infoType';
import PLACEMENTS from '../../utils/constants/placements';

export function getContainerStyle(styleParams) {
  return {
    ...((styleParams.imageInfoType === INFO_TYPE.ATTACHED_BACKGROUND ||
      styleParams.titlePlacement === PLACEMENTS.SHOW_ON_HOVER) && {
      ...getBorderStyle(
        styleParams.itemBorderRadius,
        styleParams.itemBorderWidth,
        styleParams.itemBorderColor,
      ),
      ...boxShadow(styleParams),
    }),
  };
}

function boxShadow(styleParams) {
  let boxShadow = {};
  if (styleParams.itemEnableShadow) {
    const { itemShadowBlur, itemShadowDirection, itemShadowSize } = styleParams;
    const alpha =
      ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
    const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
    const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
    boxShadow = {
      boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${styleParams.itemShadowOpacityAndColor.value}`,
    };
  }
  return boxShadow;
}

export function getImageStyle(styleParams) {
  return {
    ...(!(styleParams.titlePlacement === PLACEMENTS.SHOW_ON_HOVER) &&
      (styleParams.imageInfoType === INFO_TYPE.NO_BACKGROUND ||
        styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND) && {
        ...getBorderStyle(
          styleParams.itemBorderRadius,
          styleParams.itemBorderWidth,
          styleParams.itemBorderColor,
        ),
      }),
  };
}

function getBorderStyle(borderRadius, borderWidth, borderColor) {
  return {
    overflow: 'hidden',
    borderRadius: borderRadius,
    borderWidth: borderWidth + 'px',
    borderColor: borderColor && borderColor.value,
    ...(borderWidth && { borderStyle: 'solid' }),
  };
}

export function getOuterInfoStyle(styleParams) {
  if (styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND) {
    return {
      ...getBorderStyle(
        styleParams.textBoxBorderRadius,
        styleParams.textBoxBorderWidth,
        styleParams.textBoxBorderColor,
      ),
      ...(styleParams.titlePlacement === PLACEMENTS.SHOW_ABOVE && {
        marginBottom: styleParams.textImageSpace,
      }),
      ...(styleParams.titlePlacement === PLACEMENTS.SHOW_BELOW && {
        marginTop: styleParams.textImageSpace,
      }),
    };
  }
  return {};
}

export function getInnerInfoStyle(styleParams) {
  return {
    height: styleParams.textBoxHeight,
    ...((styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND ||
      styleParams.imageInfoType === INFO_TYPE.ATTACHED_BACKGROUND) &&
      styleParams.textBoxFillColor &&
      styleParams.textBoxFillColor.value && {
        backgroundColor: styleParams.textBoxFillColor.value,
      }),
    textAlign: styleParams.galleryTextAlign,
    paddingBottom: styleParams.textsVerticalPadding + 'px',
    paddingTop: styleParams.textsVerticalPadding + 'px',
    paddingRight: styleParams.textsHorizontalPadding + 'px',
    paddingLeft: styleParams.textsHorizontalPadding + 'px',
    overflow: 'hidden',
  };
}

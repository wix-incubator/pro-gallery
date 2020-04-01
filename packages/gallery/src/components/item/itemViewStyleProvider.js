import INFO_TYPE from '../../common/constants/infoType';
import { hasVerticalPlacement, hasHorizontalPlacement, hasHoverPlacement, hasAbovePlacement, hasBelowPlacement} from '../../common/constants/placements';

export function getContainerStyle(styleParams) {
  return {
    ...((styleParams.imageInfoType === INFO_TYPE.ATTACHED_BACKGROUND ||
      hasHoverPlacement(styleParams.titlePlacement)) &&
      {
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
  let _boxShadow = {};
  if (styleParams.itemEnableShadow) {
    const { itemShadowBlur, itemShadowDirection, itemShadowSize } = styleParams;
    const alpha =
      ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
    const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
    const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
    _boxShadow = {
      boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${styleParams.itemShadowOpacityAndColor.value}`,
    };
  }
  return _boxShadow;
}

export function getImageStyle(styleParams) {
  return {
    ...(!(hasHoverPlacement(styleParams.titlePlacement)) &&
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
    ...(borderWidth && {
      borderStyle: 'solid',
    }),
  };
}

export function getOuterInfoStyle(styleParams) {
  const styles = {
    ...((hasHorizontalPlacement(styleParams.titlePlacement)) && {
      height: '100%',
      float: 'left',
    })
  };
  if (styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND) {
    return {
      ...styles,
      ...getBorderStyle(
        styleParams.textBoxBorderRadius,
        styleParams.textBoxBorderWidth,
        styleParams.textBoxBorderColor,
      ),
      ...(hasAbovePlacement(styleParams.titlePlacement) && {
        marginBottom: styleParams.textImageSpace,
      }),
      ...(hasBelowPlacement(styleParams.titlePlacement) && {
        marginTop: styleParams.textImageSpace,
      }),
    };
  }
  return styles;
}

function getInfoHorizontalPadding(styleParams) {
  if (
    styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND ||
    styleParams.imageInfoType === INFO_TYPE.ATTACHED_BACKGROUND
  ) {
    return styleParams.textsHorizontalPadding + 30;
  }
  return styleParams.textsHorizontalPadding;
}

function getInnerInfoStylesAboveOrBelow(styleParams, infoHeight) {
  return {
    height: infoHeight,
    paddingBottom: styleParams.textsVerticalPadding + 15 + 'px',
    paddingTop: styleParams.textsVerticalPadding + 15 + 'px',
    paddingRight: getInfoHorizontalPadding(styleParams) + 'px',
    paddingLeft: getInfoHorizontalPadding(styleParams) + 'px'
  }
}

function getInnerInfoStylesRightOrLeft(styleParams, infoWidth) {
  return {
    width: infoWidth,
    height: '100%',
  }
}

export function getInnerInfoStyle(styleParams, infoHeight, infoWidth) {
  const commonStyles = {
    ...((styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND ||
      styleParams.imageInfoType === INFO_TYPE.ATTACHED_BACKGROUND) &&
      styleParams.textBoxFillColor &&
      styleParams.textBoxFillColor.value && {
        backgroundColor: styleParams.textBoxFillColor.value,
      }),
    textAlign: styleParams.galleryTextAlign,
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const infoAboveOrBelow = hasVerticalPlacement(styleParams.titlePlacement);
  const infoRightOrLeft = hasHorizontalPlacement(styleParams.titlePlacement);

  return {
    ...commonStyles,
    ...(infoAboveOrBelow && getInnerInfoStylesAboveOrBelow(styleParams, infoHeight)),
    ...(infoRightOrLeft && getInnerInfoStylesRightOrLeft(styleParams, infoWidth))
  };
}

import { GALLERY_CONSTS, optionsMap, utils } from 'pro-gallery-lib';

export function getContainerStyle(options) {
  return {
    ...((options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout].ATTACHED_BACKGROUND ||
      GALLERY_CONSTS.hasHoverPlacement(
        options[optionsMap.layoutParams.info.placement]
      )) && {
      ...getBorderStyle(
        options[optionsMap.stylingParams.itemBorderRadius],
        options[optionsMap.stylingParams.itemBorderWidth],
        options[optionsMap.stylingParams.itemBorderColor]
      ),
      ...boxShadow(options),
    }),
  };
}

function boxShadow(options) {
  let _boxShadow = {};
  if (options[optionsMap.stylingParams.itemEnableShadow]) {
    const itemShadowBlur = options[optionsMap.stylingParams.itemShadowBlur];
    const itemShadowDirection =
      options[optionsMap.stylingParams.itemShadowDirection];
    const itemShadowSize = options[optionsMap.stylingParams.itemShadowSize];
    const alpha =
      ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
    const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
    const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
    _boxShadow = {
      boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${utils.formatColor(
        options[optionsMap.stylingParams.itemShadowOpacityAndColor]
      )}`,
    };
  }
  return _boxShadow;
}

export function getImageStyle(options) {
  return {
    ...(!GALLERY_CONSTS.hasHoverPlacement(
      options[optionsMap.layoutParams.info.placement]
    ) &&
      (options[optionsMap.layoutParams.info.layout] ===
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND ||
        options[optionsMap.layoutParams.info.layout] ===
          GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
            .SEPARATED_BACKGROUND) && {
        ...getBorderStyle(
          options[optionsMap.stylingParams.itemBorderRadius],
          options[optionsMap.stylingParams.itemBorderWidth],
          options[optionsMap.stylingParams.itemBorderColor]
        ),
      }),
  };
}

function getBorderStyle(borderRadius, borderWidth, borderColor) {
  return {
    overflow: 'hidden',
    ...(borderRadius > 0 && { borderRadius }),
    ...(borderWidth > 0 && {
      borderWidth: borderWidth + 'px',
      borderColor: utils.formatColor(borderColor),
      borderStyle: 'solid',
    }),
  };
}

export function getOuterInfoStyle(placement, options, mediaHeight, infoHeight) {
  const styles = {
    ...(GALLERY_CONSTS.hasExternalHorizontalPlacement(placement) && {
      height: mediaHeight,
      float: GALLERY_CONSTS.isExternalRightPlacement(placement)
        ? 'right'
        : 'left',
    }),
    ...(GALLERY_CONSTS.hasExternalVerticalPlacement(placement) && {
      height: infoHeight,
      boxSizing: 'content-box',
    }),
  };
  if (
    options[optionsMap.layoutParams.info.layout] ===
    GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND
  ) {
    return {
      ...styles,
      ...getBorderStyle(
        options[optionsMap.layoutParams.info.border.radius],
        options[optionsMap.layoutParams.info.border.width],
        options[optionsMap.layoutParams.info.border.color]
      ),
      ...(GALLERY_CONSTS.hasExternalAbovePlacement(placement) && {
        marginBottom: options[optionsMap.layoutParams.info.spacing],
      }),
      ...(GALLERY_CONSTS.hasExternalBelowPlacement(placement) && {
        marginTop: options[optionsMap.layoutParams.info.spacing],
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
    ...((options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
        .SEPARATED_BACKGROUND ||
      options[optionsMap.layoutParams.info.layout] ===
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
          .ATTACHED_BACKGROUND) &&
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

import { window, utils, isSiteMode, isSEOMode } from 'pro-gallery-lib';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

function shouldChangeActiveElement() {
  return (isSiteMode() || isSEOMode()) && !utils.isMobile() && window.document;
}

function isThisGalleryElementInFocus(className) {
  const activeElement = window.document.activeElement;
  return String(activeElement.className).includes(className);
}

export function onAnchorFocus({
  itemContainer,
  enableExperimentalFeatures,
  itemAnchor,
}) {
  if (shouldChangeActiveElement() && enableExperimentalFeatures) {
    /* Relevant only for Screen-Reader cases:
         When we navigate on the accessibility tree, screen readers stops and focuses on the <a> tag,
         so it will not go deeper to the item-container keyDown event */
    const activeElement = window.document.activeElement;
    if (activeElement === itemAnchor) {
      itemContainer.focus();
    }
  }
}

export function changeActiveElementIfNeeded({
  prevProps,
  currentProps,
  itemContainer,
}) {
  try {
    if (
      shouldChangeActiveElement() &&
      window.document.activeElement.className
    ) {
      const isGalleryItemInFocus = isThisGalleryElementInFocus(
        'gallery-item-container'
      );
      const isShowMoreInFocus = isThisGalleryElementInFocus('show-more');

      if (isGalleryItemInFocus || isShowMoreInFocus) {
        if (
          currentProps.thumbnailHighlightId !==
            prevProps.thumbnailHighlightId &&
          currentProps.thumbnailHighlightId === currentProps.id
        ) {
          // if the highlighted thumbnail changed and it is the same as this itemview's
          itemContainer.focus();
        } else if (
          currentProps.currentIdx !== prevProps.currentIdx &&
          currentProps.currentIdx === currentProps.idx
        ) {
          //check if currentIdx has changed to the current item
          itemContainer.focus();
        }
      }
    }
  } catch (e) {
    console.error('Could not set focus to active element', e);
  }
}
export function getImageDimensions(itemProps) {
  //image dimensions are for images in grid fit - placing the image with positive margins to show it within the square
  const { styleParams, style, requiredRatio } = itemProps;
  let {
    height: requiredHeight,
    width: requiredWidth,
    maxWidth,
    maxHeight,
  } = style;
  const {
    useMaxDimensions,
    itemBorderRadius,
    imageInfoType,
    cubeType,
    cubeImages,
  } = styleParams;

  let dimensions = {};
  const isFit = cubeImages && cubeType === GALLERY_CONSTS.cubeType.FIT;
  const _height = Math.min(
    requiredHeight,
    useMaxDimensions ? maxHeight : Infinity,
    useMaxDimensions ? maxWidth / requiredRatio : Infinity
  );
  const _width = Math.min(
    requiredWidth,
    useMaxDimensions ? maxWidth : Infinity,
    useMaxDimensions ? maxHeight * requiredRatio : Infinity
  );
  const imageMarginLeft = Math.round(
    Math.max(0, (requiredWidth - _height * requiredRatio) / 2)
  );
  const imageMarginTop = Math.round(
    Math.max(0, (requiredHeight - _width / requiredRatio) / 2)
  );
  const isFitMargin = !isFit ? styleParams.itemBorderWidth : 0;
  dimensions = {
    height: requiredHeight - 2 * imageMarginTop,
    width: requiredWidth - 2 * imageMarginLeft,
    margin: `${imageMarginTop - isFitMargin}px ${
      imageMarginLeft - isFitMargin
    }px`,
  };

  if (
    itemBorderRadius &&
    imageInfoType !== GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND
  ) {
    dimensions.borderRadius = itemBorderRadius + 'px';
  }
  return dimensions;
}

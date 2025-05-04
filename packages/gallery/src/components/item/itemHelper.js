import {
  window,
  utils,
  isSiteMode,
  isSEOMode,
  GALLERY_CONSTS,
} from 'pro-gallery-lib';

function shouldChangeActiveElement(isAccessible) {
  if (isAccessible) {
    // to reduce the number of users experiencing the change
    return (isSiteMode() || isSEOMode()) && window.document;
  }
  return (isSiteMode() || isSEOMode()) && !utils.isMobile() && window.document;
}

export function onAnchorFocus({
  itemContainer,
  enableExperimentalFeatures,
  itemAnchor,
  isAccessible,
}) {
  if (shouldChangeActiveElement(isAccessible) && enableExperimentalFeatures) {
    /* Relevant only for Screen-Reader cases:
         When we navigate on the accessibility tree, screen readers stops and focuses on the <a> tag,
         so it will not go deeper to the item-container keyDown event */
    const activeElement = window.document.activeElement;
    if (activeElement === itemAnchor) {
      itemContainer.focus();
    }
  }
}

function isThisGalleryElementInFocus(className, galleryId) {
  const activeElement = window.document.activeElement;
  return (
    String(activeElement.className).includes(className) &&
    !!window.document.querySelector(
      `#pro-gallery-${galleryId} #${String(activeElement.id)}`
    )
  );
}

export function changeActiveElementIfNeeded({
  prevProps,
  currentProps,
  itemActionRef,
  isAccessible,
}) {
  try {
    if (
      shouldChangeActiveElement(isAccessible) &&
      window.document.activeElement.className
    ) {
      const isGalleryItemAction = isThisGalleryElementInFocus(
        'item-action',
        currentProps.galleryId
      );
      const isShowMoreInFocus = isThisGalleryElementInFocus(
        'show-more',
        currentProps.galleryId
      );
      if (isGalleryItemAction || isShowMoreInFocus) {
        if (
          currentProps.thumbnailHighlightId !==
            prevProps.thumbnailHighlightId &&
          currentProps.thumbnailHighlightId === currentProps.id
        ) {
          // if the highlighted thumbnail changed and it is the same as this itemview's
          itemActionRef.focus();
        } else if (
          currentProps.activeIndex !== prevProps.activeIndex &&
          currentProps.activeIndex === currentProps.idx
        ) {
          //check if activeIndex has changed to the current item
          itemActionRef.focus();
        }
      }
    }
  } catch (e) {
    console.error('Could not set focus to active element', e);
  }
}

export function shouldCreateVideoPlaceholder(options) {
  return (
    options.enableVideoPlaceholder &&
    (!utils.isSingleItemHorizontalDisplay(options) ||
      options.videoPlay !== GALLERY_CONSTS.videoPlay.AUTO)
  );
}

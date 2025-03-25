import {
  window,
  utils,
  isSiteMode,
  isSEOMode,
  GALLERY_CONSTS,
} from 'pro-gallery-lib';

function shouldChangeActiveElement() {
  return (isSiteMode() || isSEOMode()) && !utils.isMobile() && window.document;
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
      if (currentProps.settings?.isAccessible) {
        if (
          currentProps.thumbnailHighlightId !==
            prevProps.thumbnailHighlightId &&
          currentProps.thumbnailHighlightId === currentProps.id
        ) {
          // if the highlighted thumbnail changed and it is the same as this itemview's
          itemContainer.focus();
        } else if (
          currentProps.activeIndex !== prevProps.activeIndex &&
          currentProps.activeIndex === currentProps.idx
        ) {
          //check if activeIndex has changed to the current item
          itemContainer.focus();
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

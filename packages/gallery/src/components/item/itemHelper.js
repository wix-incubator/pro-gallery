import { window, utils, isSiteMode, isSEOMode } from 'pro-gallery-lib';

function shouldChangeActiveElement() {
  return (isSiteMode() || isSEOMode()) && !utils.isMobile() && window.document;
}

export function onAnchorFocus({
  itemContainer,
  shouldUseExperimentalFeature,
  itemAnchor,
}) {
  if (shouldChangeActiveElement() && shouldUseExperimentalFeature) {
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
      const activeElement = window.document.activeElement;

      //check if focus is on 'gallery-item-container' in current gallery
      const isThisGalleryItemInFocus = () =>
        !!window.document.querySelector(
          `#pro-gallery-${currentProps.domId} #${String(activeElement.id)}`
        );
      const isGalleryItemInFocus = () =>
        String(activeElement.className).indexOf('gallery-item-container') >= 0;
      //check if focus is on 'load-more' in current gallery
      const isThisGalleryShowMoreInFocus = () =>
        !!window.document.querySelector(
          `#pro-gallery-${currentProps.domId} #${String(activeElement.id)}`
        );
      const isShowMoreInFocus = () =>
        String(activeElement.className).indexOf('show-more') >= 0;

      if (
        (isGalleryItemInFocus() && isThisGalleryItemInFocus()) ||
        (isShowMoreInFocus() && isThisGalleryShowMoreInFocus())
      ) {
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

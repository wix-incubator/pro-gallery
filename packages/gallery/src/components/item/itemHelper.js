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

export function changeActiveElementIfNeeded({ prevProps, thisProps }) {
  try {
    if (
      shouldChangeActiveElement() &&
      window.document.activeElement.className
    ) {
      const activeElement = window.document.activeElement;

      //check if focus is on 'gallery-item-container' in current gallery
      const isThisGalleryItemInFocus = () =>
        !!window.document.querySelector(
          `#pro-gallery-${thisProps.domId} #${String(activeElement.id)}`
        );
      const isGalleryItemInFocus = () =>
        String(activeElement.className).indexOf('gallery-item-container') >= 0;
      //check if focus is on 'load-more' in current gallery
      const isThisGalleryShowMoreInFocus = () =>
        !!window.document.querySelector(
          `#pro-gallery-${thisProps.domId} #${String(activeElement.id)}`
        );
      const isShowMoreInFocus = () =>
        String(activeElement.className).indexOf('show-more') >= 0;

      if (
        (isGalleryItemInFocus() && isThisGalleryItemInFocus()) ||
        (isShowMoreInFocus() && isThisGalleryShowMoreInFocus())
      ) {
        if (
          thisProps.thumbnailHighlightId !== prevProps.thumbnailHighlightId &&
          thisProps.thumbnailHighlightId === thisProps.id
        ) {
          // if the highlighted thumbnail changed and it is the same as this itemview's
          thisProps.itemContainer.focus();
        } else if (
          thisProps.currentIdx !== prevProps.currentIdx &&
          thisProps.currentIdx === thisProps.idx
        ) {
          //check if currentIdx has changed to the current item
          thisProps.itemContainer.focus();
        }
      }
    }
  } catch (e) {
    console.error('Could not set focus to active element', e);
  }
}

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

export function isInFocus() {
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
        return true;
      }
    }
  } catch (e) {
    console.error('Could not set focus to active element', e);
    return false;
  }
}

export function shouldCreateVideoPlaceholder(options) {
  return (
    options.enableVideoPlaceholder &&
    (!utils.isSingleItemHorizontalDisplay(options) ||
      options.videoPlay !== GALLERY_CONSTS.videoPlay.AUTO)
  );
}

export function extractTextItemContent(html) {
  const span = document.createElement('span');
  span.innerHTML = html;
  const content = span.innerText;
  return content?.trim();
}

import { window } from 'pro-gallery-lib';

export function isGalleryInViewport(dimensions) {
  try {
    const haveAllVariablesForViewPortCalc = !!(
      dimensions &&
      Number.isInteger(dimensions.scrollBase) &&
      Number.isInteger(dimensions.galleryHeight) &&
      window &&
      window.document &&
      window.document.documentElement &&
      (Number.isInteger(window.document.documentElement.scrollTop) ||
        (window.document.scrollingElement &&
          Number.isInteger(window.document.scrollingElement.scrollTop))) &&
      Number.isInteger(window.document.documentElement.offsetHeight)
    );
    const inTopViewPort =
      haveAllVariablesForViewPortCalc &&
      dimensions.scrollBase + dimensions.galleryHeight >
        window.document.documentElement.scrollTop;
    const inBottomViewPort =
      haveAllVariablesForViewPortCalc &&
      dimensions.scrollBase <
        (window.document.documentElement.scrollTop ||
          window.document.scrollingElement.scrollTop) +
          window.document.documentElement.offsetHeight;
    return (
      (inTopViewPort && inBottomViewPort) || !haveAllVariablesForViewPortCalc
    ); // if some parameters are missing (haveAllVariablesForViewPortCalc is false) we still want the used functionality to work
  } catch (e) {
    console.warn('Could not calculate viewport', e);
    return true;
  }
}

import window from '../../../common/window/windowWrapper';

export function isGalleryInViewport(container) {
  const haveAllVariablesForViewPortCalc = !!(
    container &&
    Number.isInteger(container.scrollBase) &&
    Number.isInteger(container.galleryHeight) &&
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
    container.scrollBase + container.galleryHeight >
      window.document.documentElement.scrollTop;
  const inBottomViewPort =
    haveAllVariablesForViewPortCalc &&
    container.scrollBase <
      (window.document.documentElement.scrollTop ||
        window.document.scrollingElement.scrollTop) +
        window.document.documentElement.offsetHeight;
  return (
    (inTopViewPort && inBottomViewPort) || !haveAllVariablesForViewPortCalc
  ); // if some parameters are missing (haveAllVariablesForViewPortCalc is false) we still want the used functionality to work
}

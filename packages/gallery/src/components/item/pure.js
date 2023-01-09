export { getSlideAnimationStyles, getCustomInfoRendererProps, getLinkParams };

import { GALLERY_CONSTS, utils, isSEOMode, optionsMap } from 'pro-gallery-lib';

function getSlideAnimationStyles(
  { idx, activeIndex, options, container },
  overrideDeckTransition = false
) {
  const {
    [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
      slideAnimation,
  } = options;
  const isRTL =
    options[optionsMap.behaviourParams.gallery.layoutDirection] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
      .RIGHT_TO_LEFT;
  const baseStyles = {
    display: 'block',
  };
  switch (slideAnimation) {
    case GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].FADE:
      return {
        ...baseStyles,
        transition: `opacity 600ms ease`,
        opacity: activeIndex === idx ? 1 : 0,
      };
    case GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].DECK: {
      const rtlFix = isRTL ? 1 : -1;
      if (activeIndex < idx) {
        //the slides behind the deck
        return {
          ...baseStyles,
          transition: overrideDeckTransition
            ? `opacity 0.1s ease 0s`
            : `opacity .2s ease 600ms`,
          zIndex: -1,
          opacity: 0,
        };
      } else if (activeIndex === idx) {
        return {
          ...baseStyles,
          zIndex: 0,
          transition: overrideDeckTransition
            ? `transform 600ms ease, opacity 0.1s ease 200ms`
            : `transform 600ms ease`,
          transform: `translateX(0)`,
        };
      } else if (activeIndex > idx) {
        return {
          ...baseStyles,
          zIndex: 1,
          transition: `transform 600ms ease`,
          transform: `translateX(${rtlFix * Math.round(container.width)}px)`,
        };
      }
      break;
    }
    default:
      return {};
  }
}

function getCustomInfoRendererProps(props) {
  return { ...props, ...{ isMobile: utils.isMobile() } };
}

function getLinkParams({
  directLink,
  options,
  directShareLink,
  noFollowForSEO,
}) {
  const isSEO = isSEOMode();
  if (
    options[optionsMap.behaviourParams.item.clickAction] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK
  ) {
    const { url, target } = directLink || {};
    const shouldUseNofollow = isSEO && noFollowForSEO;
    const shouldUseDirectLink = !!(url && target);
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectLink
      ? { href: url, target, ...seoLinkParams }
      : {};
    return linkParams;
  } else if (
    options[optionsMap.behaviourParams.item.clickAction] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION
  ) {
    // place share link as the navigation item
    const url = directShareLink;
    const shouldUseDirectShareLink = !!url;
    const shouldUseNofollow =
      !options[optionsMap.behaviourParams.gallery.enableIndexingShareLinks];
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectShareLink
      ? { href: url, 'data-cancel-link': true, ...seoLinkParams }
      : {};
    return linkParams;
  }
}

export { getSlideAnimationStyles, getCustomInfoRendererProps, getLinkParams };

import { GALLERY_CONSTS, utils, isSEOMode } from 'pro-gallery-lib';

function getSlideAnimationStyles({
  isRTL,
  slideAnimation,
  container,
  visible,
  isBefore,
  isAfter,
  groupId,
}) {
  // const { isRTL, slideAnimation } = options;
  const baseStyles = {
    display: 'block',
  };
  switch (slideAnimation) {
    case GALLERY_CONSTS.slideAnimations.FADE:
      return {
        ...baseStyles,
        transition: `opacity 600ms ease`,
        opacity: visible ? 1 : 0,
      };
    case GALLERY_CONSTS.slideAnimations.DECK: {
      const rtlFix = isRTL ? 1 : -1;
      if (isAfter) {
        console.log('local isAfter', groupId);
        //the slides behind the deck
        return {
          ...baseStyles,
          transition: `opacity .2s ease 600ms`,
          zIndex: -1,
          opacity: 0,
        };
      } else if (visible) {
        console.log('local visible', groupId);
        return {
          ...baseStyles,
          zIndex: 0,
          transition: `transform 600ms ease`,
          transform: `translateX(0)`,
        };
      } else if (isBefore) {
        console.log('local isBefore', groupId);
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
  if (options.itemClick === GALLERY_CONSTS.itemClick.LINK) {
    const { url, target } = directLink || {};
    const shouldUseNofollow = isSEO && noFollowForSEO;
    const shouldUseDirectLink = !!(url && target);
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectLink
      ? { href: url, target, ...seoLinkParams }
      : {};
    return linkParams;
  } else if (
    options.itemClick === GALLERY_CONSTS.itemClick.FULLSCREEN ||
    options.itemClick === GALLERY_CONSTS.itemClick.EXPAND
  ) {
    // place share link as the navigation item
    const url = directShareLink;
    const shouldUseDirectShareLink = !!url;
    const shouldUseNofollow = !options.shouldIndexDirectShareLinkInSEO;
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectShareLink
      ? { href: url, 'data-cancel-link': true, ...seoLinkParams }
      : {};
    return linkParams;
  }
}

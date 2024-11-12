export { getCustomInfoRendererProps, getLinkParams };

import { GALLERY_CONSTS, utils, isSEOMode } from 'pro-gallery-lib';

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
  return {};
}

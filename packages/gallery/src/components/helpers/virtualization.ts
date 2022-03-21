import {
  GALLERY_CONSTS,
  VirtualizationSettings,
  Options,
} from 'pro-gallery-lib';

export function getItemsInViewportOrMarginByActiveGroup({
  groups,
  options,
  virtualizationSettings,
  galleryWidth,
  galleryHeight,
  activeIndex,
}: {
  groups: any[];
  options: Options;
  virtualizationSettings?: VirtualizationSettings;
  galleryWidth: number;
  galleryHeight: number;
  activeIndex: number;
}): { group: any; shouldRender: boolean }[] {
  const {
    enabled = false,
    forwardItemMargin = 3,
    backwardItemMargin = 3,
    forwardItemScrollMargin = 10,
    backwardItemScrollMargin = 10,
  } = virtualizationSettings || {};

  const isHorizontal =
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
  const isScrollable =
    !isHorizontal ||
    options.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL;
  if (!enabled) {
    return groups.map((group) => ({
      group,
      shouldRender: true,
    }));
  }
  const size = isHorizontal ? galleryWidth : galleryHeight;
  const unit = isHorizontal ? 'width' : 'height';
  const rightRenderBuffer = isScrollable
    ? forwardItemScrollMargin
    : forwardItemMargin;
  const leftRenderBuffer = isScrollable
    ? backwardItemScrollMargin
    : backwardItemMargin;

  let accoumilatedRightMargin = 0;
  let accoumilatedLeftMargin = 0;

  function shouldRenderGroup(group) {
    const { items } = group;
    const first = items[0];
    const last = items[items.length - 1];
    const firstIndex = first.idx ?? first.fullscreenIdx;
    const lastIndex = last.idx ?? last.fullscreenIdx;
    const groupPrecOfScreen = group[unit] / size;
    if (firstIndex > activeIndex) {
      accoumilatedRightMargin += groupPrecOfScreen;
      if (accoumilatedRightMargin > rightRenderBuffer) {
        return false;
      }
    }
    if (lastIndex < activeIndex) {
      accoumilatedLeftMargin += groupPrecOfScreen;
      if (accoumilatedLeftMargin > leftRenderBuffer) {
        return false;
      }
    }
    return true;
  }
  return groups.map((group) => {
    const shouldRender = shouldRenderGroup(group);
    return { group, shouldRender };
  });
}

export function getItemsInViewportOrMarginByScrollLocation({
  items,
  options,
  virtualizationSettings,
  galleryWidth,
  galleryHeight,
  scrollPosition,
}: {
  items: any[];
  options: Options;
  virtualizationSettings?: VirtualizationSettings;
  galleryWidth: number;
  galleryHeight: number;
  scrollPosition: number;
}): { item: any; shouldRender: boolean }[] {
  const {
    enabled = false,
    forwardItemScrollMargin = 10,
    backwardItemScrollMargin = 10,
  } = virtualizationSettings || {};

  if (!enabled) {
    return items.map((item) => ({
      item,
      shouldRender: true,
    }));
  }
  const isHorizontal =
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
  const size = isHorizontal ? galleryWidth : galleryHeight;
  const unit = isHorizontal ? 'width' : 'height';

  function shouldRenderItem(item) {
    const group = item.group;
    const locationUnit = unit === 'height' ? 'top' : 'left';
    const location = group[locationUnit];
    const locationEnd = location + group[unit];
    const viewportStart = scrollPosition - size * backwardItemScrollMargin;
    const viewportEnd = scrollPosition + size * forwardItemScrollMargin;
    return location > viewportStart && locationEnd < viewportEnd;
  }
  return items.map((item) => ({
    item,
    shouldRender: shouldRenderItem(item),
  }));
}

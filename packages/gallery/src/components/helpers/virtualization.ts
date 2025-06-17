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
    enabled = true,
    forwardItemMargin = 3,
    backwardItemMargin = 3,
    forwardItemScrollMargin = 4,
    backwardItemScrollMargin = 4,
  } = virtualizationSettings || {};

  const isHorizontal =
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
  const isScrollable =
    !isHorizontal ||
    options.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL;
  const getFallbackGroups = () => {
    return groups.map((group) => ({
      group,
      shouldRender: true,
    }));
  };
  if (!enabled) {
    return getFallbackGroups();
  }

  try {
    const size = isHorizontal ? galleryWidth : galleryHeight;
    const unit = isHorizontal ? 'width' : 'height';
    const rightRenderBuffer = isScrollable
      ? forwardItemScrollMargin
      : forwardItemMargin;
    const leftRenderBuffer = isScrollable
      ? backwardItemScrollMargin
      : backwardItemMargin;

    const activeGroupIndex = groups.findIndex((group) => {
      const { items } = group;
      const first = items[0];
      const last = items[items.length - 1];
      const firstIndex = first.idx ?? first.fullscreenIdx;
      const lastIndex = last.idx ?? last.fullscreenIdx;
      return firstIndex <= activeIndex && lastIndex >= activeIndex;
    });

    const activeGroup = groups[activeGroupIndex];
    const activeGroupPrecOfScreen = activeGroup[unit] / size;
    let accoumilatedRightMargin = activeGroupPrecOfScreen;
    let accoumilatedLeftMargin = activeGroupPrecOfScreen;
    const groupsToRender: any[] = [activeGroup];
    for (
      let index = 1;
      accoumilatedRightMargin < rightRenderBuffer ||
      accoumilatedLeftMargin < leftRenderBuffer;
      index++
    ) {
      const groupToRight = groups[activeGroupIndex + index];
      const groupToLeft = groups[activeGroupIndex - index];
      if (groupToRight && accoumilatedRightMargin < rightRenderBuffer) {
        const groupPrecOfScreen = groupToRight[unit] / size;
        accoumilatedRightMargin += groupPrecOfScreen;
        groupsToRender.push(groupToRight);
      }
      if (groupToLeft && accoumilatedLeftMargin < leftRenderBuffer) {
        const groupPrecOfScreen = groupToLeft[unit] / size;
        accoumilatedLeftMargin += groupPrecOfScreen;
        groupsToRender.push(groupToLeft);
      }
      if (!groupToLeft && !groupToRight) {
        break;
      }
    }
    return groups.map((group) => {
      return { group, shouldRender: groupsToRender.includes(group) };
    });
  } catch (error) {
    console.error('pro-gallery could virtualize groups: ', error);
    return getFallbackGroups();
  }
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

  const getFallbackItems = () => {
    return items.map((item) => ({
      item,
      shouldRender: true,
    }));
  };
  if (!enabled) {
    return getFallbackItems();
  }

  try {
    const isHorizontal =
      options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
    const size = isHorizontal ? galleryWidth : galleryHeight;
    const unit = isHorizontal ? 'width' : 'height';

    const shouldRenderItem = (item) => {
      const group = item.group;
      const locationUnit = unit === 'height' ? 'top' : 'left';
      const location = group[locationUnit];
      const locationEnd = location + group[unit];
      const viewportStart = scrollPosition - size * backwardItemScrollMargin;
      const viewportEnd = scrollPosition + size * forwardItemScrollMargin;
      return location > viewportStart && locationEnd < viewportEnd;
    };
    return items.map((item) => ({
      item,
      shouldRender: shouldRenderItem(item),
    }));
  } catch (error) {
    console.error('pro-gallery could virtualize items: ', error);
    return getFallbackItems();
  }
}

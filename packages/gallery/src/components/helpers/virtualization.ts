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
  totalItemsCount,
  skipSlidesMultiplier = 1.5,
}: {
  groups: any[];
  options: Options;
  virtualizationSettings?: VirtualizationSettings;
  galleryWidth: number;
  galleryHeight: number;
  activeIndex: number;
  totalItemsCount?: number;
  skipSlidesMultiplier?: number;
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

  // Handle loop case - prepare items at loop destination
  const loopDestinationGroups: any[] = [];
  if (
    options.slideshowLoop &&
    totalItemsCount &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
  ) {
    // Calculate the skipFromSlide and destination values
    const skipFromSlide = Math.round(totalItemsCount * skipSlidesMultiplier);

    // If we're approaching the skip point (within buffer distance)
    if (activeIndex > skipFromSlide - rightRenderBuffer * 2) {
      // Find the destination groups (around 0.5*totalItemsCount)
      const skipToSlide = skipFromSlide - totalItemsCount;

      const destinationGroupIndex = groups.findIndex((group) => {
        const { items } = group;
        const first = items[0];
        const last = items[items.length - 1];
        const firstIndex = first.idx ?? first.fullscreenIdx;
        const lastIndex = last.idx ?? last.fullscreenIdx;
        return firstIndex <= skipToSlide && lastIndex >= skipToSlide;
      });

      if (destinationGroupIndex >= 0) {
        // Add the destination group and its buffer
        const destGroup = groups[destinationGroupIndex];
        loopDestinationGroups.push(destGroup);

        // Add buffer groups around destination
        for (
          let i = 1;
          i <= Math.max(leftRenderBuffer, rightRenderBuffer);
          i++
        ) {
          if (groups[destinationGroupIndex + i])
            loopDestinationGroups.push(groups[destinationGroupIndex + i]);
          if (groups[destinationGroupIndex - i])
            loopDestinationGroups.push(groups[destinationGroupIndex - i]);
        }
      }
    }
  }

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

  // Combine normal buffer and loop destination buffer
  const allGroupsToRender = [...groupsToRender, ...loopDestinationGroups];

  return groups.map((group) => {
    return { group, shouldRender: allGroupsToRender.includes(group) };
  });
}

export function getItemsInViewportOrMarginByScrollLocation({
  items,
  options,
  virtualizationSettings,
  galleryWidth,
  galleryHeight,
  scrollPosition,
  totalItemsCount,
  skipSlidesMultiplier = 1.5,
}: {
  items: any[];
  options: Options;
  virtualizationSettings?: VirtualizationSettings;
  galleryWidth: number;
  galleryHeight: number;
  scrollPosition: number;
  totalItemsCount?: number;
  skipSlidesMultiplier?: number;
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

    // Normal case - item is within viewport buffer
    if (location > viewportStart && locationEnd < viewportEnd) {
      return true;
    }

    // Additional check for loop case
    if (
      options.slideshowLoop &&
      totalItemsCount &&
      options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
    ) {
      const skipFromSlide = Math.round(totalItemsCount * skipSlidesMultiplier);
      const skipToSlide = skipFromSlide - totalItemsCount;

      // Get the expected position after loop jump
      const idx = item.idx ?? item.fullscreenIdx;

      // If we're close to skip threshold and this item would be visible after the jump
      if (scrollPosition > skipFromSlide - size * forwardItemScrollMargin) {
        // Calculate where this item would be in relation to the loop destination
        const distanceFromDestination = Math.abs(idx - skipToSlide);
        return (
          distanceFromDestination <
          Math.max(forwardItemScrollMargin, backwardItemScrollMargin)
        );
      }
    }

    return false;
  }

  return items.map((item) => ({
    item,
    shouldRender: shouldRenderItem(item),
  }));
}

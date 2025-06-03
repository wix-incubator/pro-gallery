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
  console.log('=== Virtualization by Active Group ===');
  console.log('Input params:', {
    activeIndex,
    galleryWidth,
    galleryHeight,
    groupsCount: groups.length,
    options: {
      scrollDirection: options.scrollDirection,
      slideAnimation: options.slideAnimation,
    },
    virtualizationSettings,
  });

  const {
    enabled = true,
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

  console.log('Gallery settings:', {
    isHorizontal,
    isScrollable,
    margins: {
      forward: isScrollable ? forwardItemScrollMargin : forwardItemMargin,
      backward: isScrollable ? backwardItemScrollMargin : backwardItemMargin,
    },
  });

  const getFallbackGroups = () => {
    console.log('Using fallback - rendering all groups');
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

    console.log('Buffer settings:', {
      size,
      unit,
      rightRenderBuffer,
      leftRenderBuffer,
    });

    const activeGroupIndex = groups.findIndex((group) => {
      const { items } = group;
      const first = items[0];
      const last = items[items.length - 1];
      const firstIndex = first.idx ?? first.fullscreenIdx;
      const lastIndex = last.idx ?? last.fullscreenIdx;
      return firstIndex <= activeIndex && lastIndex >= activeIndex;
    });

    console.log('Active group found:', {
      activeGroupIndex,
      activeIndex,
      groupDetails:
        activeGroupIndex !== -1
          ? {
              firstItem: groups[activeGroupIndex]?.items[0],
              lastItem:
                groups[activeGroupIndex]?.items[
                  groups[activeGroupIndex]?.items.length - 1
                ],
            }
          : 'Not found',
    });

    const activeGroup = groups[activeGroupIndex];
    const activeGroupPrecOfScreen = activeGroup[unit] / size;
    let accoumilatedRightMargin = activeGroupPrecOfScreen;
    let accoumilatedLeftMargin = activeGroupPrecOfScreen;
    const groupsToRender: any[] = [activeGroup];

    console.log('Starting margin calculation:', {
      activeGroupPrecOfScreen,
      accoumilatedRightMargin,
      accoumilatedLeftMargin,
    });

    for (
      let index = 1;
      accoumilatedRightMargin < rightRenderBuffer ||
      accoumilatedLeftMargin < leftRenderBuffer;
      index++
    ) {
      const groupToRight = groups[activeGroupIndex + index];
      const groupToLeft = groups[activeGroupIndex - index];
      console.log(`Iteration ${index}:`, {
        groupToRight: groupToRight
          ? {
              index: activeGroupIndex + index,
              size: groupToRight[unit],
            }
          : null,
        groupToLeft: groupToLeft
          ? {
              index: activeGroupIndex - index,
              size: groupToLeft[unit],
            }
          : null,
        currentMargins: {
          right: accoumilatedRightMargin,
          left: accoumilatedLeftMargin,
        },
      });

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
        console.log('No more groups to process');
        break;
      }
    }

    console.log('Final groups to render:', {
      totalGroups: groups.length,
      groupsToRender: groupsToRender.length,
      groupsToRenderIndices: groupsToRender.map((g) => groups.indexOf(g)),
    });

    return groups.map((group) => {
      const shouldRender = groupsToRender.includes(group);
      return { group, shouldRender };
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
  console.log('=== Virtualization by Scroll Location ===');
  console.log('Input params:', {
    scrollPosition,
    galleryWidth,
    galleryHeight,
    itemsCount: items.length,
    options: {
      scrollDirection: options.scrollDirection,
      slideAnimation: options.slideAnimation,
    },
    virtualizationSettings,
  });

  const {
    enabled = false,
    forwardItemScrollMargin = 10,
    backwardItemScrollMargin = 10,
  } = virtualizationSettings || {};

  console.log('Scroll margins:', {
    forward: forwardItemScrollMargin,
    backward: backwardItemScrollMargin,
  });

  const getFallbackItems = () => {
    console.log('Using fallback - rendering all items');
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

    console.log('Scroll settings:', {
      isHorizontal,
      size,
      unit,
      viewportStart: scrollPosition - size * backwardItemScrollMargin,
      viewportEnd: scrollPosition + size * forwardItemScrollMargin,
    });

    const shouldRenderItem = (item) => {
      const group = item.group;
      const locationUnit = unit === 'height' ? 'top' : 'left';
      const location = group[locationUnit];
      const locationEnd = location + group[unit];
      const viewportStart = scrollPosition - size * backwardItemScrollMargin;
      const viewportEnd = scrollPosition + size * forwardItemScrollMargin;
      const shouldRender =
        location > viewportStart && locationEnd < viewportEnd;
      console.log(`Item ${item.idx ?? item.fullscreenIdx}:`, {
        location,
        locationEnd,
        viewportStart,
        viewportEnd,
        shouldRender,
      });
      return shouldRender;
    };

    const result = items.map((item) => ({
      item,
      shouldRender: shouldRenderItem(item),
    }));

    console.log('Final items to render:', {
      totalItems: items.length,
      itemsToRender: result.filter((r) => r.shouldRender).length,
    });

    return result;
  } catch (error) {
    console.error('pro-gallery could virtualize items: ', error);
    return getFallbackItems();
  }
}

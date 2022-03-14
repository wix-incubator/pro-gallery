import { GALLERY_CONSTS, Options } from 'pro-gallery-lib';

export function getItemsInViewportOrMargin({
  groups,
  options,
  galleryWidth,
  activeIndex,
}: {
  groups: any[];
  options: Options;
  galleryWidth: number;
  activeIndex: number;
}) {
  const {
    enabled = false,
    rightItemMargin = 3,
    leftItemMargin = 3,
    rightItemScrollMargin = 10,
    leftItemScrollMargin = 10,
  } = options.behaviourParams?.gallery?.horizontal?.itemVirtualization || {};
  const isScrollable =
    options.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL;
  if (!enabled) {
    return groups.map((group) => ({ group, shouldRender: true }));
  }
  const rightRenderBuffer = isScrollable
    ? rightItemScrollMargin
    : rightItemMargin;
  const leftRenderBuffer = isScrollable ? leftItemScrollMargin : leftItemMargin;
  let accoumilatedRightMargin = 0;
  let accoumilatedLeftMargin = 0;
  return groups.map((group) => {
    const { items } = group;
    const first = items[0];
    const last = items[items.length - 1];
    const firstIndex = first.idx ?? first.fullscreenIdx;
    const lastIndex = last.idx ?? last.fullscreenIdx;
    const groupPrecOfScreen = group.width / galleryWidth;
    if (firstIndex > activeIndex) {
      accoumilatedRightMargin += groupPrecOfScreen;
      if (accoumilatedRightMargin > rightRenderBuffer) {
        return { group, shouldRender: false };
      }
    }
    if (lastIndex < activeIndex) {
      accoumilatedLeftMargin += groupPrecOfScreen;
      if (accoumilatedLeftMargin > leftRenderBuffer) {
        return { group, shouldRender: false };
      }
    }
    return {
      group,
      shouldRender: true,
    };
  });
}

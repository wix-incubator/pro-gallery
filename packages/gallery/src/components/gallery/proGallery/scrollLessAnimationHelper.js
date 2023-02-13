import { GALLERY_CONSTS } from 'pro-gallery-lib';

export const getSlideAnimationClassNames = (
  { idx, activeIndex, options },
  overrideDeckTransition = false
) => {
  const { isRTL, slideAnimation } = options;
  switch (slideAnimation) {
    case GALLERY_CONSTS.slideAnimations.FADE:
      return `fade fade-${activeIndex === idx ? 'visible' : 'hidden'}`;
    case GALLERY_CONSTS.slideAnimations.DECK: {
      if (activeIndex < idx) {
        return `deck-after ${overrideDeckTransition ? 'override' : ''}`;
      } else if (activeIndex === idx) {
        return `deck-current ${overrideDeckTransition ? 'override' : ''}`;
      } else if (activeIndex > idx) {
        return `deck-before${isRTL ? '-rtl' : ''}`;
      }
      return {};
    }
    default:
      return {};
  }
};

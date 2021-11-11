export { getSlideAnimationStyles };

import { GALLERY_CONSTS } from 'pro-gallery-lib';

function getSlideAnimationStyles({ idx, activeIndex, options, container }) {
  const { isRTL, slideAnimation } = options;
  const baseStyles = {
    position: 'absolute',
    display: 'block',
  };
  switch (slideAnimation) {
    case GALLERY_CONSTS.slideAnimations.FADE:
      return {
        ...baseStyles,
        transition: `opacity 600ms ease`,
        opacity: activeIndex === idx ? 1 : 0,
      };
    case GALLERY_CONSTS.slideAnimations.DECK: {
      const rtlFix = isRTL ? 1 : -1;
      if (activeIndex < idx) {
        //the slides behind the deck
        return {
          ...baseStyles,
          transition: `opacity .2s ease 600ms`,
          zIndex: -1,
          opacity: 0,
        };
      } else if (activeIndex === idx) {
        return {
          ...baseStyles,
          zIndex: 0,
          transition: `transform 600ms ease`,
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

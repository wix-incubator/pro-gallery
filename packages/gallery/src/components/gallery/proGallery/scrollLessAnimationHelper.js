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

export const toggleScrollLessAnimation = (callback) => {
  const toggleDeckTransitions = (isPaused) => {
    console.log('toggleScrollLessAnimation: ', isPaused);
    ['.gallery-item-wrapper', '.gallery-item-common-info-outer'].forEach(
      (className) => {
        if (isPaused) {
          [...document.querySelectorAll(className)].forEach((item) => {
            item.classList?.add('disabled-transition');
          });
        } else {
          [...document.querySelectorAll(className)].forEach((item) => {
            // item.offsetHeight; is to trigger a reflow and flush all the CSS changes.
            item.offsetHeight;
            item.classList?.remove('disabled-transition');
          });
        }
      }
    );
  };

  setTimeout(() => {
    callback && callback();
    toggleDeckTransitions(true);
    toggleDeckTransitions(false);
  }, 600);
};

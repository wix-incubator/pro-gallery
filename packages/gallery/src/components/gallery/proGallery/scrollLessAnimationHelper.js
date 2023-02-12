import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

export const getSlideAnimationClassNames = (
  { idx, activeIndex, options },
  overrideDeckTransition = false
) => {
  const {
    [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
      slideAnimation,
  } = options;
  const isRTL =
    options[optionsMap.behaviourParams.gallery.layoutDirection] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
      .RIGHT_TO_LEFT;
  switch (slideAnimation) {
    case GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].FADE:
      return `fade fade-${activeIndex === idx ? 'visible' : 'hidden'}`;
    case GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].DECK: {
      if (activeIndex < idx) {
        return `deck-behind ${overrideDeckTransition ? 'override' : ''}`;
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
    ['.gallery-item-wrapper', '.gallery-item-common-info-outer'].forEach(
      (className) => {
        if (isPaused) {
          [...document.querySelectorAll(className)].forEach((item) => {
            item.classList?.add('disabled-transition');
          });
        } else {
          [...document.querySelectorAll(className)].forEach((item) => {
            item.offsetHeight;
            item.classList?.remove('disabled-transition');
          });
        }
      }
    );
  };

  setTimeout(() => {
    toggleDeckTransitions(true);
    callback && callback();
    toggleDeckTransitions(false);
  }, 600);
};

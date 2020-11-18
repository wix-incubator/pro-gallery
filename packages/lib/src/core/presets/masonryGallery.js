import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.MASONRY,
  cubeImages: false,
  scrollDirection: SCROLL_DIRECTION.VERTICAL,
  groupSize: 1,
  groupTypes: '1',
  slideshowLoop: false,

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  fixedColumns: 0,
  enableScroll: true,
  isGrid: false,
  isSlider: false,
  isMasonry: true,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
  oneRow: false,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(
      styles,
      styles.isVertical
        ? styles.gallerySize * 8 + 200
        : styles.gallerySize * 5 + 200
    ),
  };
};

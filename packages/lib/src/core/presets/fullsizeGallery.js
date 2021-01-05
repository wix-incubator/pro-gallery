import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.FULLSIZE,
  cubeImages: true,
  cubeRatio: '100%/100%',
  cubeType: 'fill',
  oneRow: true,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  galleryMargin: 0,
  isVertical: false,
  groupSize: 1,
  groupTypes: '1',

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  smartCrop: false,
  galleryType: 'Strips',
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: false,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  cropOnlyFill: false,
  scatter: 0,
  rotatingScatter: '',
  imageMargin: 0,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};

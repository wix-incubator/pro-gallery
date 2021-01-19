import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.ALTERNATE,
  cubeType: 'fill',
  cubeImages: true,
  cubeRatio: 1,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  scrollDirection: SCROLL_DIRECTION.VERTICAL,
  galleryMargin: 0,
  isVertical: true,
  groupSize: 3,
  collageDensity: 0.48,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  gallerySize: 86,
  minItemSize: 50,
  chooseBestGroup: true,
  rotatingGroupTypes: '1,2h,1,2h',
  smartCrop: false,
  scatter: 0,
  rotatingScatter: '',
  fixedColumns: 1,
  groupsPerStrip: 0,
  oneRow: false,
  placeGroupsLtr: false,
  repeatingCropRatios: '',
  slideshowLoop: false,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};

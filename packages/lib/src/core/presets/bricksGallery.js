import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToBricks = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.BRICKS;
  presetStyles.cubeType = 'fill';
  presetStyles.cubeImages = true;
  presetStyles.cubeRatio = 1;
  presetStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetStyles.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetStyles.galleryMargin = 0;
  presetStyles.isVertical = true;
  presetStyles.groupSize = 3;
  presetStyles.collageDensity = 0.8;
  presetStyles.groupTypes = '1,2h,2v,3t,3b,3l,3r,3v,3h';
  presetStyles.slideshowLoop = false;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.gallerySize = 400;
  presetStyles.minItemSize = 50;
  presetStyles.chooseBestGroup = true;
  presetStyles.rotatingGroupTypes = '2h';
  presetStyles.smartCrop = false;
  presetStyles.scatter = 0;
  presetStyles.rotatingScatter = '';
  presetStyles.fixedColumns = 1;
  presetStyles.groupsPerStrip = 0;
  presetStyles.placeGroupsLtr = false;
  presetStyles.rotatingCropRatios = '0.707,1.414,1.414,0.707';
  return presetStyles;
};

export const fixedStyles = fixToBricks({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToBricks(res);
  res.targetItemSize = calcTargetItemSize(styles);
  return res;
};

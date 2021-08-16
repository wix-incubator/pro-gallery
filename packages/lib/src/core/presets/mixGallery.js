import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/stylesUtils';

const fixToMix = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.MIX;
  presetStyles.cubeType = 'fill';
  presetStyles.cubeImages = true;
  presetStyles.cropRatio = 1;
  presetStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetStyles.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetStyles = assignByString(presetStyles, 'layoutParams_gallerySpacing', 0);
  presetStyles.isVertical = true;
  presetStyles.groupSize = 3;
  presetStyles.groupTypes = '1,2h,2v,3t,3b,3l,3r,3v,3h';
  presetStyles.collageDensity = 0.48;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.targetItemSize = 86;
  presetStyles.minItemSize = 50;
  presetStyles.chooseBestGroup = true;
  presetStyles.rotatingGroupTypes = '1,3l,1,3r';
  presetStyles.smartCrop = false;
  presetStyles.scatter = 0;
  presetStyles.rotatingScatter = '';
  presetStyles.fixedColumns = 1;
  presetStyles.groupsPerStrip = 0;
  presetStyles.placeGroupsLtr = false;
  presetStyles.rotatingCropRatios = '';
  return presetStyles;
};
export const fixedStyles = fixToMix({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToMix(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

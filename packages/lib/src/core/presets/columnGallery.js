import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';
const fixToColumn = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.COLUMN;
  presetStyles.cubeType = 'fill';
  presetStyles.cubeImages = true;
  presetStyles = assignByString(presetStyles, 'layoutParams_cropRatio', 0.35);
  presetStyles.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetStyles.isVertical = false;
  presetStyles.groupSize = 1;
  presetStyles.groupTypes = '1';
  presetStyles.slideshowLoop = false;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetStyles.smartCrop = false;
  presetStyles.galleryType = 'Strips';
  presetStyles.fixedColumns = 0;
  presetStyles.enableScroll = true;
  presetStyles.isGrid = false;
  presetStyles.isColumns = true;
  presetStyles.isMasonry = false;
  presetStyles.isSlider = false;
  presetStyles.isSlideshow = false;
  presetStyles.cropOnlyFill = false;
  return presetStyles;
};
export const fixedStyles = fixToColumn({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToColumn(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

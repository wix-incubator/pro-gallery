import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';
const fixToColumn = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.COLUMN;
  presetOptions.cubeType = 'fill';
  presetOptions.cubeImages = true;
  presetOptions = assignByString(presetOptions, 'layoutParams_cropRatio', 0.35);
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.slideshowLoop = false;

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.fixedColumns = 0;
  presetOptions.enableScroll = true;
  presetOptions.isGrid = false;
  presetOptions.isColumns = true;

  presetOptions.isSlider = false;
  presetOptions.isSlideshow = false;
  presetOptions.cropOnlyFill = false;
  return presetOptions;
};
export const fixedOptions = fixToColumn({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToColumn(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

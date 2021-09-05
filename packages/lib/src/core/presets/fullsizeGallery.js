import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';

const fixToFullsize = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.FULLSIZE;
  presetOptions.cubeImages = true;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetOptions.cubeType = 'fill';
  presetOptions.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions.galleryMargin = 0;
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.hasThumbnails = false;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.isGrid = false;
  presetOptions.isSlider = false;
  presetOptions.isColumns = false;

  presetOptions.isSlideshow = false;
  presetOptions.cropOnlyFill = false;
  presetOptions.scatter = 0;
  presetOptions.rotatingScatter = '';
  presetOptions.imageMargin = 0;
  return presetOptions;
};
export const fixedOptions = fixToFullsize({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToFullsize(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

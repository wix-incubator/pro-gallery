import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';

const fixToThumbnail = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.THUMBNAIL;
  presetOptions.enableInfiniteScroll = true;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_cropRatio',
    '100%/100%'
  );
  presetOptions.cubeImages = true;
  presetOptions.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_gallerySpacing',
    0
  );
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';

  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.hasThumbnails = true;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.isGrid = false;
  presetOptions.isSlider = false;
  presetOptions.isMasonry = false;
  presetOptions.isColumns = false;
  presetOptions.isSlideshow = false;
  presetOptions.cropOnlyFill = false;
  presetOptions.scatter = 0;
  presetOptions.rotatingScatter = '';
  presetOptions.imageMargin = 0;
  return presetOptions;
};
export const fixedOptions = fixToThumbnail({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToThumbnail(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {
  calcTargetItemSize,
  removeBordersIfNeeded,
} from '../helpers/layoutHelper';
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
  presetOptions.numberOfImagesPerCol = 1;
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.hasThumbnails = true;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
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
  res = removeBordersIfNeeded(res);
  return res;
};

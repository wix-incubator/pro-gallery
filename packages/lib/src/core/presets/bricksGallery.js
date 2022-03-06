import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import { assignByString } from '../helpers/optionsUtils';
import GRID_STYLE from '../../common/constants/gridStyle';

const fixToBricks = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.BRICKS;
  presetOptions.cubeType = 'fill';
  presetOptions.cubeImages = true;
  presetOptions = assignByString(presetOptions, 'layoutParams_cropRatio', 1);
  presetOptions.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetOptions.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_gallerySpacing',
    0
  );
  presetOptions.isVertical = true;
  presetOptions.groupSize = 3;
  presetOptions.collageDensity = 0.8;
  presetOptions.groupTypes = '1,2h,2v,3t,3b,3l,3r,3v,3h';
  presetOptions.slideshowLoop = false;
  presetOptions.gridStyle = GRID_STYLE.SET_ITEMS_PER_ROW;
  presetOptions.gallerySize = 400;
  presetOptions.minItemSize = 50;
  presetOptions.chooseBestGroup = true;
  presetOptions = assignByString(
    presetOptions,
    'layoutParams_repeatingGroupTypes',
    '2h'
  );
  presetOptions.smartCrop = false;
  presetOptions.scatter = 0;
  presetOptions.rotatingScatter = '';
  presetOptions.fixedColumns = 1;
  presetOptions.groupsPerStrip = 0;
  presetOptions.placeGroupsLtr = false;
  presetOptions.rotatingCropRatios = '0.707,1.414,1.414,0.707';
  return presetOptions;
};

export const fixedOptions = fixToBricks({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToBricks(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

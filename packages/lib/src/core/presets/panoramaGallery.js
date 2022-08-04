import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import GRID_STYLE from '../../common/constants/gridStyle';

const fixToPanorama = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.PANORAMA;
  presetOptions.cubeImages = false;
  presetOptions.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetOptions.isVertical = true;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.gridStyle = GRID_STYLE.SET_ITEMS_PER_ROW;
  presetOptions.galleryType = 'Columns';
  presetOptions.fixedColumns = 1;
  presetOptions.enableScroll = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.slideshowLoop = false;
  return presetOptions;
};
export const fixedOptions = fixToPanorama({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToPanorama(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};

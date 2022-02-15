import LAYOUTS from '../../common/constants/layout';
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
  processNumberOfImagesPerCol,
  removeBordersIfNeeded,
} from '../helpers/layoutHelper';

const fixToGrid = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.GRID;
  presetOptions.cubeImages = true;
  presetOptions.isVertical = true;
  presetOptions.groupSize = 1;
  presetOptions.hasThumbnails = false;
  presetOptions.groupTypes = '1';
  presetOptions.slideshowLoop = false;
  // this params were moved from the presets in layoutHelper and were not tested and checked yet.
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Columns';
  presetOptions.targetItemSize = 0;
  presetOptions.enableScroll = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.minItemSize = 50;
  presetOptions.collageDensity = 0;
  return presetOptions;
};

export const fixedOptions = fixToGrid({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToGrid(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.gallerySize * 8.5 + 150)
  );
  res = processNumberOfImagesPerRow(res);
  res = processNumberOfImagesPerCol(res);
  res = removeBordersIfNeeded(res);
  return res;
};

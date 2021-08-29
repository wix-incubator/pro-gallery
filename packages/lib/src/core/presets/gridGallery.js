import LAYOUTS from '../../common/constants/layout';
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
  processNumberOfImagesPerCol,
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
  presetOptions.fixedColumns = 0;
  presetOptions.targetItemSize = 0;
  presetOptions.enableScroll = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.isSlider = false;
  presetOptions.isColumns = false;
  presetOptions.isGrid = true;
  presetOptions.isMasonry = false;
  presetOptions.isSlideshow = false;
  presetOptions.minItemSize = 50;
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
  return res;
};

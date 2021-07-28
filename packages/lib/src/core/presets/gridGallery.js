import LAYOUTS from '../../common/constants/layout';
import {
  calcTargetItemSize,
  mutateNumberOfImagesPerRow,
  mutateNumberOfImagesPerCol,
} from '../helpers/layoutHelper';

const fixToGrid = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.GRID;
  presetStyles.cubeImages = true;
  presetStyles.isVertical = true;
  presetStyles.groupSize = 1;
  presetStyles.hasThumbnails = false;
  presetStyles.groupTypes = '1';
  presetStyles.slideshowLoop = false;
  presetStyles.smartCrop = false;
  presetStyles.galleryType = 'Columns';
  presetStyles.fixedColumns = 0;
  presetStyles.targetItemSize = 0;
  presetStyles.enableScroll = true;
  presetStyles.cropOnlyFill = false;
  presetStyles.isSlider = false;
  presetStyles.isColumns = false;
  presetStyles.isGrid = true;
  presetStyles.isMasonry = false;
  presetStyles.isSlideshow = false;
  presetStyles.minItemSize = 50;
  return presetStyles;
};

export const fixedStyles = fixToGrid({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToGrid(res);
  res.targetItemSize = calcTargetItemSize(
    styles,
    Math.round(styles.gallerySize * 8.5 + 150)
  );
  res = mutateNumberOfImagesPerRow(res);
  res = mutateNumberOfImagesPerCol(res); //TODO rename back to process
  return res;
};

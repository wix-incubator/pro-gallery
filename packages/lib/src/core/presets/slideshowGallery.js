import { calcTargetItemSize, removeBordersIfNeeded } from '../helpers/layoutHelper';
import disableAnimationsForSlideshowLayouts from './disableAnimationsForSlideshowLayouts';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToSlideshow = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW;
  presetOptions[optionsMap.layoutParams.crop.ratios] = ['100%/100%'];
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;

  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;

  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.info.placement] = GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.stylingParams.itemBorderWidth] = 0;
  presetOptions[optionsMap.stylingParams.itemBorderRadius] = 0;
  presetOptions[optionsMap.stylingParams.itemBorderColor] = undefined;
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  disableAnimationsForSlideshowLayouts(presetOptions);
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.targetItemSize.value] = 550;

  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 1;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap] = true;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;

  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;

  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.itemSpacing] = 0;

  //layouter direct API
  presetOptions.fixedColumns = 1;
  //layouter direct API
  return presetOptions;
};
export const fixedOptions = fixToSlideshow({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlideshow(res);
  res.targetItemSize = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};

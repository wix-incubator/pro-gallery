import {
  calcTargetItemSize,
  removeBordersIfNeeded,
} from '../helpers/newSPs_layoutHelper';
import disableAnimationsForSlideshowLayouts from './newSPs_disableAnimationsForSlideshowLayouts';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToSlideshow = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW;
  presetOptions[optionsMap.layoutParams.crop.ratios] = ['100%/100%'];
  presetOptions[optionsMap.layoutParams.crop.enable] = true;

  presetOptions[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] =
    GALLERY_CONSTS[
      optionsMap.behaviourParams.item.overlay.hoveringBehaviour
    ].NEVER_SHOW;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.scrollDirection
    ].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;

  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.info.placement] =
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW;
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
  presetOptions[optionsMap.layoutParams.thumbnails.enable] = false;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap
  ] = true;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;

  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;

  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.itemSpacing] = 0;
  return presetOptions;
};
export const fixedOptions = fixToSlideshow({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlideshow(res);
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};

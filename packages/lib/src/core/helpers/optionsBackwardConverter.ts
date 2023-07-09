import { trimUndefinedValues_flat } from './optionsUtils';
import { isLayout } from '../../common/constants/layoutParams_structure_galleryLayout';
import optionsMap from './optionsMap';
import {
  nameChangedLayoutParams,
  nameChangedBehaviourParams,
  nameChangedStylingParams,
  reversedLayoutParams,
  reversedBehaviourParams,
  changeNames,
  namingChange,
  reverseBooleans,
} from './migratorStore';

function addOldOptions(flatOptions) {
  const flat_migrated = reverseMigrateOptions(flatOptions);
  let flat_combinedOptions = {
    ...trimUndefinedValues_flat(flat_migrated),
    ...trimUndefinedValues_flat(flatOptions),
  };
  flat_combinedOptions.wasConvertedToOldOptions = true;
  return flat_combinedOptions;
}

function reverseMigrateOptions(flatOptionsObject) {
  let oldOptions = { ...flatOptionsObject };
  ///----------- LAYOUT -------------///
  oldOptions = changeNames(
    oldOptions,
    [...nameChangedLayoutParams].map((ele) => [...ele].reverse())
  );
  oldOptions = reverseBooleans(
    oldOptions,
    [...reversedLayoutParams].map((ele) => [...ele].reverse())
  );
  oldOptions = process_new_to_old_ThumbnailAlignment(oldOptions);
  oldOptions = process_new_to_old_ScrollDirection(oldOptions);
  oldOptions = process_new_to_old_LayoutOrientation(oldOptions);
  oldOptions = process_new_to_old_groupsOrder(oldOptions);
  oldOptions = process_new_to_old_responsiveMode(oldOptions);
  oldOptions = process_new_to_old_NumberOfColumns(oldOptions); // fixedColumns || numberOfImagesPerRow ||
  oldOptions = process_new_to_old_targetItemSizeUnit(oldOptions);
  oldOptions = process_new_to_old_targetItemSizeValue(oldOptions);
  oldOptions = process_new_to_old_CroppedAlignment(oldOptions);
  oldOptions = process_new_to_old_CropRatio(oldOptions);
  oldOptions = process_new_to_old_textBoxSizeMode(oldOptions);
  oldOptions = process_new_to_old_columnRatios(oldOptions);
  oldOptions = process_new_to_old_cropMethod(oldOptions);
  oldOptions = process_new_to_old_GroupTypes(oldOptions);
  oldOptions = process_new_to_old_AllowedGroupTypes(oldOptions);
  oldOptions = process_new_to_old_gallerySpacing(oldOptions);
  oldOptions = process_new_to_old_slideshowInfoSize(oldOptions);
  oldOptions = process_new_to_old_arrowsPosition(oldOptions);
  ///----------- BEHAVIOUR -------------///
  oldOptions = changeNames(
    oldOptions,
    [...nameChangedBehaviourParams].map((ele) => [...ele].reverse())
  );
  oldOptions = reverseBooleans(
    oldOptions,
    [...reversedBehaviourParams].map((ele) => [...ele].reverse())
  );
  oldOptions = process_new_to_old_ClickAction(oldOptions);
  oldOptions = process_new_to_old_VideoPlayTrigger(oldOptions);
  oldOptions = process_new_to_old_VideoVolume(oldOptions);
  oldOptions = process_new_to_old_VideoSpeed(oldOptions);
  oldOptions = process_new_to_old_OverlayHoveringBehaviour(oldOptions);
  oldOptions = process_new_to_old_InfoPlacement(oldOptions);
  oldOptions = process_new_to_old_layoutDirection(oldOptions);
  oldOptions = process_new_to_old_LoadMoreAmount(oldOptions);
  oldOptions = process_new_to_old_AutoSlideBehaviour(oldOptions);
  oldOptions = process_new_to_old_galleryTextAlign(oldOptions);
  ///----------- STYLING -------------///
  oldOptions = changeNames(
    oldOptions,
    [...nameChangedStylingParams].map((ele) => [...ele].reverse())
  );
  return oldOptions;
}

//----- refactor functions ----------//
function process_new_to_old_ThumbnailAlignment(obj) {
  //['galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment'],
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.thumbnails.alignment, 'galleryThumbnailsAlignment');
  _obj['galleryThumbnailsAlignment'] = _obj['galleryThumbnailsAlignment']?.toLowerCase();
  return _obj;
}
function process_new_to_old_targetItemSizeUnit(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.targetItemSize.unit, 'gallerySizeType');
  switch (_obj['gallerySizeType']) {
    case 'PIXEL':
      _obj['gallerySizeType'] = 'px';
      break;
    case 'PERCENT':
      _obj['gallerySizeType'] = 'ratio';
      break;
    case 'SMART':
      _obj['gallerySizeType'] = 'smart';
      break;
  }
  return _obj;
}
function process_new_to_old_targetItemSizeValue(obj) {
  let _obj = obj;
  let value = _obj[optionsMap.layoutParams.targetItemSize.value];
  let type = _obj['gallerySizeType'];
  let keys = {
    smart: 'gallerySize',
    px: 'gallerySizePx',
    ratio: 'gallerySizeRatio',
  };
  _obj['gallerySize'] = _obj['gallerySizePx'] = _obj['gallerySizeRatio'] = undefined;
  _obj[keys[type]] = value;
  delete _obj[optionsMap.layoutParams.targetItemSize.value];
  return _obj;
}
function process_new_to_old_slideshowInfoSize(obj) {
  let _obj = obj;
  const isSlideshow = isLayout('SLIDESHOW')({
    galleryLayout: obj.galleryLayout >= -3 ? obj.galleryLayout : obj.layoutParams?.structure?.galleryLayout,
  });
  if (isSlideshow) {
    _obj = namingChange(_obj, optionsMap.layoutParams.info.height, 'slideshowInfoSize');
    _obj['textBoxHeight'] = _obj['slideshowInfoSize'];
  } else {
    _obj = namingChange(_obj, optionsMap.layoutParams.info.height, 'textBoxHeight');
    _obj['slideshowInfoSize'] = _obj['textBoxHeight'];
  }
  return _obj;
}
function process_new_to_old_textBoxSizeMode(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.info.sizeUnits, 'calculateTextBoxWidthMode');
  switch (_obj['calculateTextBoxWidthMode']) {
    case 'PERCENT':
      _obj['calculateTextBoxWidthMode'] = 'PERCENT';
      _obj = namingChange(_obj, optionsMap.layoutParams.info.width, 'textBoxWidthPercent');
      _obj['textBoxWidth'] = _obj['textBoxWidth'] || 200;
      break;
    case 'PIXEL':
      _obj['calculateTextBoxWidthMode'] = 'MANUAL';
      _obj = namingChange(_obj, optionsMap.layoutParams.info.width, 'textBoxWidth');
      _obj['textBoxWidthPercent'] = _obj['textBoxWidthPercent'] || 50;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_arrowsPosition(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.navigationArrows.position, 'arrowsPosition');
  switch (_obj['arrowsPosition']) {
    case 'ON_GALLERY':
      _obj['arrowsPosition'] = 0;
      break;
    case 'OUTSIDE_GALLERY':
      _obj['arrowsPosition'] = 1;
      break;
    case 'MOUSE_CURSOR':
      _obj['arrowsPosition'] = 2;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_responsiveMode(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.structure.responsiveMode, 'gridStyle');
  switch (_obj['gridStyle']) {
    case 'FIT_TO_SCREEN':
      _obj['gridStyle'] = 0;
      break;
    case 'SET_ITEMS_PER_ROW':
      _obj['gridStyle'] = 1;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_columnRatios(obj) {
  let _obj = obj;

  _obj = namingChange(_obj, optionsMap.layoutParams.structure.columnRatios, 'columnWidths');
  _obj['columnWidths'] = _obj['columnWidths']
    ? _obj['columnWidths'].join
      ? _obj['columnWidths'].join(',')
      : ''
    : undefined;
  return _obj;
}
function process_new_to_old_cropMethod(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.crop.method, 'cubeType');
  _obj['cubeType'] = _obj['cubeType']?.toLowerCase();
  return _obj;
}
function process_new_to_old_VideoPlayTrigger(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.item.video.playTrigger, 'videoPlay');
  switch (_obj['videoPlay']) {
    case 'CLICK':
      _obj['videoPlay'] = 'onClick';
      break;
    case 'HOVER':
      _obj['videoPlay'] = 'hover';
      break;
    case 'AUTO':
      _obj['videoPlay'] = 'auto';
      break;
    default:
      break;
  }
  return _obj;
}
// function process_old_to_new_targetItemSizeMode(obj) {
//   let _obj = obj;
//   _obj = namingChange(
//     _obj,
//     'gallerySizeType',
//     optionsMap.layoutParams.targetItemSize.mode
//   );
//   _obj.layoutParams.targetItemSize.mode =
//     _obj.layoutParams.targetItemSize.mode?.toUpperCase();
//   return _obj;
// }
function process_new_to_old_VideoVolume(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.item.video.volume, 'videoSound');
  _obj['videoSound'] = typeof _obj['videoSound'] === 'undefined' ? undefined : !!_obj['videoSound'];
  return _obj;
}
function process_new_to_old_VideoSpeed(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.item.video.speed, 'videoSpeed');
  _obj['videoSpeed'] = _obj['videoSpeed'] >= 0 ? String(_obj['videoSpeed']) : undefined;
  return _obj;
}

function process_new_to_old_gallerySpacing(obj) {
  let _obj = obj;
  _obj['layoutParams_gallerySpacing'] = _obj['galleryMargin'] = _obj['layoutParams_structure_gallerySpacing'];
  delete _obj['layoutParams_structure_gallerySpacing'];
  return _obj;
}
function process_new_to_old_ScrollDirection(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.structure.scrollDirection, 'scrollDirection');
  switch (_obj['scrollDirection']) {
    case 'VERTICAL':
      _obj['scrollDirection'] = 0;
      break;
    case 'HORIZONTAL':
      _obj['scrollDirection'] = 1;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_layoutDirection(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.gallery.layoutDirection, 'isRTL');
  switch (_obj['isRTL']) {
    case 'RIGHT_TO_LEFT':
      _obj['isRTL'] = true;
      break;
    case 'LEFT_TO_RIGHT':
      _obj['isRTL'] = false;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_LayoutOrientation(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.structure.layoutOrientation, 'isVertical');
  switch (_obj['isVertical']) {
    case 'VERTICAL':
      _obj['isVertical'] = true;
      break;
    case 'HORIZONTAL':
      _obj['isVertical'] = false;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_groupsOrder(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.structure.groupsOrder, 'placeGroupsLtr');
  switch (_obj['placeGroupsLtr']) {
    case 'LEFT_TO_RIGHT':
      _obj['placeGroupsLtr'] = true;
      break;
    case 'RIGHT_TO_LEFT':
    case 'BY_HEIGHT':
      _obj['placeGroupsLtr'] = false;
      break;
    default:
      _obj['placeGroupsLtr'] = undefined;
  }
  // 'RIGHT_TO_LEFT' doesnt exist yet.
  return _obj;
}
function process_new_to_old_galleryTextAlign(obj) {
  let _obj = obj;
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment,
    'galleryTextAlign'
  );
  _obj['galleryTextAlign'] = _obj['galleryTextAlign']?.toLowerCase();
  return _obj;
}
function process_new_to_old_LoadMoreAmount(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.gallery.vertical.loadMore.amount, 'loadMoreAmount');
  _obj['loadMoreAmount'] = _obj['loadMoreAmount']?.toLowerCase();
  return _obj;
}
function process_new_to_old_CroppedAlignment(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.crop.alignment, 'cubeFitPosition');
  switch (_obj['cubeFitPosition']) {
    case 'CENTER':
      _obj['cubeFitPosition'] = 'MIDDLE';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_OverlayHoveringBehaviour(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.item.overlay.hoveringBehaviour, 'hoveringBehaviour');
  switch (_obj['hoveringBehaviour']) {
    case 'ALWAYS_SHOW':
      _obj['hoveringBehaviour'] = 'NO_CHANGE';
      break;
    case 'NEVER_SHOW':
      _obj['hoveringBehaviour'] = 'NEVER_SHOW';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_InfoPlacement(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.layoutParams.info.placement, 'titlePlacement');
  switch (_obj['titlePlacement']) {
    case 'OVERLAY':
      _obj['titlePlacement'] = 'SHOW_ON_HOVER';
      break;
    case 'BELOW':
      _obj['titlePlacement'] = 'SHOW_BELOW';
      break;
    case 'ABOVE':
      _obj['titlePlacement'] = 'SHOW_ABOVE';
      break;
    case 'RIGHT':
      _obj['titlePlacement'] = 'SHOW_ON_THE_RIGHT';
      break;
    case 'LEFT':
      _obj['titlePlacement'] = 'SHOW_ON_THE_LEFT';
      break;
    case 'ALTERNATE_HORIZONTALLY':
      _obj['titlePlacement'] = 'ALTERNATE_HORIZONTAL';
      break;
    case 'ALTERNATE_VERTICALLY':
      _obj['titlePlacement'] = 'ALTERNATE_VERTICAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_ClickAction(obj) {
  let _obj = obj;
  _obj = namingChange(_obj, optionsMap.behaviourParams.item.clickAction, 'itemClick');
  _obj['itemClick'] = _obj['itemClick']?.toLowerCase();
  switch (_obj['itemClick']) {
    case 'action':
      _obj['itemClick'] = 'expand';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_AutoSlideBehaviour(obj) {
  let _obj = obj;
  let val = _obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour];
  switch (val) {
    case 'OFF':
      _obj.isAutoSlideshow = false;
      _obj.autoSlideshowType = 'interval';
      break;
    case 'INTERVAL':
      _obj.isAutoSlideshow = true;
      _obj.autoSlideshowType = 'interval';
      break;
    case 'CONTINUOUS':
      _obj.isAutoSlideshow = true;
      _obj.autoSlideshowType = 'continuous';
      break;
  }
  delete _obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour];
  return _obj;
}
function process_new_to_old_CropRatio(obj) {
  let _obj = obj;
  let rotatingCropRatioVal;
  const val = _obj[optionsMap.layoutParams.crop.ratios] && [..._obj[optionsMap.layoutParams.crop.ratios]];
  let newVal = val || [];
  if (newVal.length > 1) {
    rotatingCropRatioVal = newVal.slice(0).join(',');
  } else if (val?.length === 0) {
    rotatingCropRatioVal = '';
  } else {
    rotatingCropRatioVal = undefined;
  }
  _obj['layoutParams_cropRatio'] = _obj['cubeRatio'] = newVal[0];
  _obj.rotatingCropRatios = rotatingCropRatioVal;
  delete _obj[optionsMap.layoutParams.crop.ratios];
  return _obj;
}
function process_new_to_old_AllowedGroupTypes(obj) {
  let _obj = obj;
  _obj['groupTypes'] = _obj[optionsMap.layoutParams.groups.allowedGroupTypes]
    ? _obj[optionsMap.layoutParams.groups.allowedGroupTypes].join
      ? _obj[optionsMap.layoutParams.groups.allowedGroupTypes].join(',')
      : ''
    : undefined;
  delete _obj[optionsMap.layoutParams.groups.allowedGroupTypes];
  return _obj;
}

function process_new_to_old_GroupTypes(obj) {
  let _obj = obj;
  let repeatingVal =
    _obj[optionsMap.layoutParams.groups.repeatingGroupTypes] &&
    _obj[optionsMap.layoutParams.groups.repeatingGroupTypes].join(',');
  _obj['layoutParams_repeatingGroupTypes'] = _obj['rotatingGroupTypes'] = repeatingVal;
  delete _obj[optionsMap.layoutParams.groups.repeatingGroupTypes];
  return _obj;
}
function process_new_to_old_NumberOfColumns(obj) {
  let _obj = obj;
  _obj.numberOfImagesPerRow = _obj[optionsMap.layoutParams.structure.numberOfColumns];
  delete _obj[optionsMap.layoutParams.structure.numberOfColumns];
  return _obj;
}

export { addOldOptions, reverseMigrateOptions };

import {
  mergeNestedObjects,
  flattenObject,
  flatToNested,
} from './optionsUtils';
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

export function addOldOptions(options) {
  let oldOptions = reverseMigrateOptions(options);
  let combinedOptions = mergeNestedObjects(oldOptions, options);
  return combinedOptions;
}

export function reverseMigrateOptions(oldStyles) {
  let newStyles = flattenObject({ ...oldStyles });

  ///----------- LAYOUT -------------///
  newStyles = changeNames(
    newStyles,
    [...nameChangedLayoutParams].map((ele) => ele.reverse())
  );
  newStyles = reverseBooleans(
    newStyles,
    [...reversedLayoutParams].map((ele) => ele.reverse())
  );
  newStyles = process_new_to_old_ThumbnailAlignment(newStyles);
  newStyles = process_new_to_old_ScrollDirection(newStyles);
  newStyles = process_new_to_old_LayoutOrientation(newStyles);
  newStyles = process_new_to_old_ForceGroupsOrder(newStyles);
  newStyles = process_old_to_new_GroupTypes(newStyles);

  newStyles = process_new_to_old_NumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow (notice its losing if its 0)
  newStyles = process_new_to_old_targetItemSizeUnit(newStyles);
  newStyles = process_new_to_old_targetItemSizeValue(newStyles);
  newStyles = process_new_to_old_CroppedAlignment(newStyles);
  newStyles = process_new_to_old_CropRatio(newStyles);
  newStyles = process_new_to_old_textBoxSizeMode(newStyles);
  newStyles = process_new_to_old_columnRatios(newStyles);
  newStyles = process_new_to_old_cropMethod(newStyles);
  ///----------- BEHAVIOUR -------------///
  newStyles = changeNames(
    newStyles,
    [...nameChangedBehaviourParams].map((ele) => ele.reverse())
  );
  newStyles = reverseBooleans(
    newStyles,
    [...reversedBehaviourParams].map((ele) => ele.reverse())
  );
  newStyles = process_new_to_old_ClickAction(newStyles);
  newStyles = process_new_to_old_VideoPlayTrigger(newStyles);
  newStyles = process_new_to_old_VideoVolume(newStyles);
  newStyles = process_new_to_old_VideoSpeed(newStyles);
  newStyles = process_new_to_old_OverlayHoveringBehaviour(newStyles);
  newStyles = process_new_to_old_InfoPlacement(newStyles);
  newStyles = process_new_to_old_layoutDirection(newStyles);
  newStyles = process_new_to_old_LoadMoreAmount(newStyles);
  newStyles = process_new_to_old_AutoSlideBehaviour(newStyles);

  ///----------- STYLING -------------///

  newStyles = changeNames(
    newStyles,
    [...nameChangedStylingParams].map((ele) => ele.reverse())
  );

  // delete newStyles.textBoxWidthPercent;
  // delete newStyles.enableLeanGallery;
  // delete newStyles.fullscreen;
  // delete newStyles.magicLayoutSeed;
  // delete newStyles.gridStyle;
  return flatToNested(newStyles);
}

//----- refactor functions ----------//
function process_new_to_old_ThumbnailAlignment(obj) {
  //['galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment'],
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.thumbnails.alignment,
    'galleryThumbnailsAlignment'
  );
  _obj['galleryThumbnailsAlignment'] =
    _obj['galleryThumbnailsAlignment'].toLowerCase();
  return _obj;
}
function process_new_to_old_targetItemSizeUnit(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.targetItemSize.unit,
    'gallerySizeType'
  );
  _obj['gallerySizeType'] = _obj['gallerySizeType']?.toLowerCase();
  return _obj;
}
function process_new_to_old_targetItemSizeValue(obj) {
  let _obj = { ...obj };
  let value = _obj[optionsMap.layoutParams.targetItemSize.value];
  _obj['gallerySize'] =
    _obj['gallerySizePx'] =
    _obj['gallerySizeRatio'] =
      value;

  delete _obj[optionsMap.layoutParams.targetItemSize.value];
  return _obj;
}
function process_new_to_old_textBoxSizeMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.info.sizeUnits,
    'calculateTextBoxWidthMode'
  );
  switch (_obj['calculateTextBoxWidthMode']) {
    case 'PERCENT':
      _obj['calculateTextBoxWidthMode'] = 'PERCENT';
      break;
    case 'PIXEL':
      _obj['calculateTextBoxWidthMode'] = 'MANUAL';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_columnRatios(obj) {
  let _obj = { ...obj };

  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.columnRatios,
    'columnWidths'
  );
  _obj['columnWidths'] = _obj['columnWidths'].join(',');
  return _obj;
}
function process_new_to_old_cropMethod(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, optionsMap.layoutParams.cropMethod, 'cubeType');
  _obj['cubeType'] = _obj['cubeType'].toLowerCase();
  return _obj;
}
function process_new_to_old_VideoPlayTrigger(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.item.video.playTrigger,
    'videoPlay'
  );
  _obj['videoPlay'] = _obj['videoPlay'].toLowerCase();
  return _obj;
}
// function process_old_to_new_targetItemSizeMode(obj) {
//   let _obj = { ...obj };
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
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.item.video.volume,
    'videoSound'
  );
  _obj['videoSound'] = _obj['videoSound'] ? true : false;
  return _obj;
}
function process_new_to_old_VideoSpeed(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.item.video.speed,
    'videoSpeed'
  );
  _obj['videoSpeed'] = String(_obj['videoSpeed']);
  return _obj;
}
function process_new_to_old_ScrollDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.scrollDirection,
    'scrollDirection'
  );
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
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.gallery.layoutDirection,
    'isRTL'
  );
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
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.layoutOrientation,
    'isVertical'
  );
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
function process_new_to_old_ForceGroupsOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.forceGroupsOrder,
    'placeGroupsLtr'
  );
  switch (_obj['placeGroupsLtr']) {
    case 'LEFT_TO_RIGHT':
      _obj['placeGroupsLtr'] = true;
      break;
    default:
      _obj['placeGroupsLtr'] = false;
      break;
  }
  // 'RIGHT_TO_LEFT' doesnt exist yet.
  return _obj;
}
function process_new_to_old_LoadMoreAmount(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.gallery.vertical.loadMore.amount,
    'loadMoreAmount'
  );
  _obj['loadMoreAmount'] = _obj['loadMoreAmount'].toLowerCase();
  return _obj;
}
function process_new_to_old_CroppedAlignment(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.croppedAlignment,
    'cubeFitPosition'
  );
  switch (_obj['cubeFitPosition']) {
    case 'CENTER':
      _obj['cubeFitPosition'] = 'MIDDLE';
      break;
    default:
      break;
  }
  return _obj;
}
// function process_old_to_new_InfoBackgroundMode(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'imageInfoType',
//     optionsMap.layoutParams.info.backgroundMode
//   );
//   switch (_obj.layoutParams.info.backgroundMode) {
//     case 'DONT_SHOW':
//       _obj.layoutParams.info.backgroundMode = 'NO_BACKGROUND';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
function process_new_to_old_OverlayHoveringBehaviour(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.item.overlay.hoveringBehaviour,
    'hoveringBehaviour'
  );
  switch (_obj['hoveringBehaviour']) {
    case 'ALWAYS_VISIBLE':
      _obj['hoveringBehaviour'] = 'NO_CHANGE';
      break;
    case 'NEVER_VISIBLE':
      _obj['hoveringBehaviour'] = 'NEVER_SHOW';
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_InfoPlacement(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.info.placement,
    'titlePlacement'
  );
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
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.behaviourParams.item.clickAction,
    'itemClick'
  );
  _obj['itemClick'] = _obj['itemClick'].toLowerCase();
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
  let _obj = { ...obj };
  let val =
    _obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviou];
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
  delete _obj[
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
  ];
  return _obj;
}
function process_new_to_old_CropRatio(obj) {
  let _obj = { ...obj };
  let rotatingCropRatioVal;
  let newVal = [..._obj[optionsMap.layoutParams.cropRatios]];

  if (newVal.length > 1) {
    rotatingCropRatioVal = newVal.join(',');
  } else {
    rotatingCropRatioVal = '';
  }
  _obj['layoutParams_cropRatio'] = newVal[0];
  _obj.rotatingCropRatios = rotatingCropRatioVal;
  delete _obj[optionsMap.layoutParams.cropRatios];
  return _obj;
}
function process_old_to_new_GroupTypes(obj) {
  let _obj = { ...obj };
  console.log(_obj);
  let newVal = _obj[optionsMap.layoutParams.collage.groupTypes];
  let repeatingVal =
    obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
  if (newVal.length > 1) {
    repeatingVal = newVal.join(',');
  } else {
    repeatingVal = '';
  }
  delete _obj[optionsMap.layoutParams.collage.groupTypes];
  _obj['layoutParams_repeatingGroupTypes'] = repeatingVal;
  _obj['groupTypes'] = newVal[0];
  return _obj;
}
function process_new_to_old_NumberOfColumns(obj) {
  let _obj = { ...obj };
  _obj.fixedColumns = _obj.numberOfColumns;
  _obj.numberOfImagesPerRow = _obj.numberOfColumns;
  _obj.groupsPerStrip = _obj.numberOfColumns;
  return _obj;
}

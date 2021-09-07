import {
  mergeNestedObjects,
  flattenObject,
  flatToNested,
} from './optionsUtils';
import { isLayout } from '../../common/constants/layout';
import cloneDeep from 'lodash/cloneDeep';
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
  let newStyles = flattenObject(cloneDeep(oldStyles));
  ///----------- LAYOUT -------------///
  newStyles = changeNames(
    newStyles,
    [...nameChangedLayoutParams].map((ele) => [...ele].reverse())
  );
  newStyles = reverseBooleans(
    newStyles,
    [...reversedLayoutParams].map((ele) => [...ele].reverse())
  );
  newStyles = process_new_to_old_ThumbnailAlignment(newStyles);
  newStyles = process_new_to_old_ScrollDirection(newStyles);
  newStyles = process_new_to_old_LayoutOrientation(newStyles);
  newStyles = process_new_to_old_groupsOrder(newStyles);
  newStyles = process_new_to_old_responsiveMode(newStyles);
  newStyles = process_new_to_old_NumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow ||
  newStyles = process_new_to_old_targetItemSizeUnit(newStyles);
  newStyles = process_new_to_old_targetItemSizeValue(newStyles);
  newStyles = process_new_to_old_CroppedAlignment(newStyles);
  newStyles = process_new_to_old_CropRatio(newStyles);
  newStyles = process_new_to_old_textBoxSizeMode(newStyles);
  newStyles = process_new_to_old_columnRatios(newStyles);
  newStyles = process_new_to_old_cropMethod(newStyles);
  newStyles = process_new_to_old_GroupTypes(newStyles);
  newStyles = process_new_to_old_AllowedGroupTypes(newStyles);
  newStyles = process_new_to_old_gallerySpacing(newStyles);
  newStyles = process_new_to_old_slideshowInfoSize(newStyles);
  ///----------- BEHAVIOUR -------------///
  newStyles = changeNames(
    newStyles,
    [...nameChangedBehaviourParams].map((ele) => [...ele].reverse())
  );
  newStyles = reverseBooleans(
    newStyles,
    [...reversedBehaviourParams].map((ele) => [...ele].reverse())
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
    [...nameChangedStylingParams].map((ele) => [...ele].reverse())
  );
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
  let _obj = { ...obj };
  let value = _obj[optionsMap.layoutParams.targetItemSize.value];
  let type = _obj['gallerySizeType'];
  let keys = {
    smart: 'gallerySize',
    px: 'gallerySizePx',
    ratio: 'gallerySizeRatio',
  };
  _obj['gallerySize'] = _obj['gallerySizePx'] = _obj['gallerySizeRatio'] = 0;
  _obj[keys[type]] = value;
  delete _obj[optionsMap.layoutParams.targetItemSize.value];
  return _obj;
}
function process_new_to_old_slideshowInfoSize(obj) {
  let _obj = { ...obj };
  const isSlideshow = isLayout('SLIDESHOW')({
    galleryLayout:
      obj.galleryLayout >= -3
        ? obj.galleryLayout
        : obj.layoutParams.structure.galleryLayout,
  });
  if (isSlideshow) {
    _obj = namingChange(
      _obj,
      optionsMap.layoutParams.info.height,
      'slideshowInfoSize'
    );
    _obj['textBoxHeight'] = _obj['slideshowInfoSize'];
  } else {
    _obj = namingChange(
      _obj,
      optionsMap.layoutParams.info.height,
      'textBoxHeight'
    );
    _obj['slideshowInfoSize'] = _obj['textBoxHeight'];
  }
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
      _obj = namingChange(
        _obj,
        optionsMap.layoutParams.info.width,
        'textBoxWidthPercent'
      );
      _obj['textBoxWidth'] = _obj['textBoxWidth'] || 200;
      break;
    case 'PIXEL':
      _obj['calculateTextBoxWidthMode'] = 'MANUAL';
      _obj = namingChange(
        _obj,
        optionsMap.layoutParams.info.width,
        'textBoxWidth'
      );
      _obj['textBoxWidthPercent'] = _obj['textBoxWidthPercent'] || 50;
      break;
    default:
      break;
  }
  return _obj;
}
function process_new_to_old_responsiveMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.structure.responsiveMode,
    'gridStyle'
  );
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
  let _obj = { ...obj };

  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.structure.columnRatios,
    'columnWidths'
  );
  _obj['columnWidths'] = _obj['columnWidths'].join(',');
  return _obj;
}
function process_new_to_old_cropMethod(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, optionsMap.layoutParams.crop.method, 'cubeType');
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
function process_new_to_old_gallerySpacing(obj) {
  let _obj = { ...obj };
  if (_obj.galleryMargin >= 0 && !(_obj['layoutParams_gallerySpacing'] >= 0)) {
    _obj['layoutParams_gallerySpacing'] = _obj.galleryMargin;
  }
  delete _obj.galleryMargin;
  return _obj;
}
function process_new_to_old_ScrollDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.structure.scrollDirection,
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
    optionsMap.layoutParams.structure.layoutOrientation,
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
function process_new_to_old_groupsOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    optionsMap.layoutParams.structure.groupsOrder,
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
    optionsMap.layoutParams.crop.alignment,
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
    _obj[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour];
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
  let newVal = [..._obj[optionsMap.layoutParams.crop.ratios]];

  if (newVal.length > 1) {
    rotatingCropRatioVal = newVal.join(',');
  } else {
    rotatingCropRatioVal = '';
  }
  _obj['layoutParams_cropRatio'] = newVal[0];
  _obj.rotatingCropRatios = rotatingCropRatioVal;
  delete _obj[optionsMap.layoutParams.crop.ratios];
  return _obj;
}
function process_new_to_old_AllowedGroupTypes(obj) {
  let _obj = { ...obj };

  let val = _obj[optionsMap.layoutParams.groups.allowedGroupTypes];
  _obj['groupTypes'] = val.join(',');
  delete _obj[optionsMap.layoutParams.groups.allowedGroupTypes];
  return _obj;
}

function process_new_to_old_GroupTypes(obj) {
  let _obj = { ...obj };
  let repeatingVal =
    _obj[optionsMap.layoutParams.groups.repeatingGroupTypes].join(',');

  _obj['layoutParams_repeatingGroupTypes'] = repeatingVal;
  delete _obj[optionsMap.layoutParams.groups.repeatingGroupTypes];
  return _obj;
}
function process_new_to_old_NumberOfColumns(obj) {
  let _obj = { ...obj };
  _obj.fixedColumns = 0;
  _obj.numberOfImagesPerRow =
    _obj[optionsMap.layoutParams.structure.numberOfColumns];
  delete _obj[optionsMap.layoutParams.structure.numberOfColumns];
  return _obj;
}

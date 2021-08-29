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
  // newStyles = process_new_to_old_GroupTypes(newStyles);
  // newStyles = process_new_to_old_NumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow (notice its losing if its 0)
  // newStyles = process_new_to_old_InfoBackgroundMode(newStyles);
  // newStyles = process_new_to_old_targetItemSizeMode(newStyles);
  // newStyles = process_new_to_old_CroppedAlignment(newStyles);
  // newStyles = process_new_to_old_CropRatio(newStyles);

  ///----------- BEHAVIOUR -------------///
  newStyles = changeNames(
    newStyles,
    [...nameChangedBehaviourParams].map((ele) => ele.reverse())
  );
  newStyles = reverseBooleans(
    newStyles,
    [...reversedBehaviourParams].map((ele) => ele.reverse())
  );
  // newStyles = process_new_to_old_ClickAction(newStyles);
  // newStyles = process_new_to_old_VideoPlayTrigger(newStyles);
  // newStyles = process_new_to_old_VideoVolume(newStyles);
  // newStyles = process_new_to_old_VideoSpeed(newStyles);
  // newStyles = process_new_to_old_OverlayHoveringBehaviour(newStyles);
  // newStyles = process_new_to_old_InfoPlacement(newStyles);
  // newStyles = process_new_to_old_layoutDirection(newStyles);
  // newStyles = process_new_to_old_LoadMoreAmount(newStyles);
  // newStyles = process_new_to_old_AutoSlideBehaviour(newStyles);

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
// function process_old_to_new_VideoPlayTrigger(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'videoPlay',
//     optionsMap.behaviourParams.item.video.playTrigger
//   );
//   _obj.behaviourParams.item.video.playTrigger =
//     _obj.behaviourParams.item.video.playTrigger?.toUpperCase();
//   return _obj;
// }
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
// function process_old_to_new_VideoVolume(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'videoSound',
//     optionsMap.behaviourParams.item.video.volume
//   );
//   _obj.behaviourParams.item.video.volume = _obj.behaviourParams.item.video
//     .volume
//     ? _obj.behaviourParams.item.video.volume
//     : 0;
//   return _obj;
// }
// function process_old_to_new_VideoSpeed(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'videoSpeed',
//     optionsMap.behaviourParams.item.video.speed
//   );
//   _obj.behaviourParams.item.video.volume = Number(
//     _obj.behaviourParams.item.video.volume
//   );
//   return _obj;
// }
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
// function process_old_to_new_layoutDirection(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'isRTL',
//     optionsMap.behaviourParams.gallery.layoutDirection
//   );
//   switch (_obj.behaviourParams.gallery.layoutDirection) {
//     case true:
//       _obj.behaviourParams.gallery.layoutDirection = 'RIGHT_TO_LEFT';
//       break;
//     case false:
//       _obj.behaviourParams.gallery.layoutDirection = 'LEFT_TO_RIGHT';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
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
// function process_old_to_new_LoadMoreAmount(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'loadMoreAmount',
//     optionsMap.behaviourParams.gallery.vertical.loadMore.amount
//   );
//   _obj.behaviourParams.gallery.vertical.loadMore.amount =
//     _obj.behaviourParams.gallery.vertical.loadMore.amount?.toUpperCase();
//   return _obj;
// }
// function process_old_to_new_CroppedAlignment(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'cubeFitPosition',
//     optionsMap.layoutParams.croppedAlignment
//   );
//   switch (_obj.layoutParams.croppedAlignment) {
//     case 'MIDDLE':
//       _obj.layoutParams.croppedAlignment = 'CENTER';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
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
// function process_old_to_new_OverlayHoveringBehaviour(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'hoveringBehaviour',
//     optionsMap.behaviourParams.item.overlay.hoveringBehaviour
//   );
//   switch (_obj.behaviourParams.item.overlay.hoveringBehaviour) {
//     case 'NO_CHANGE':
//       _obj.behaviourParams.item.overlay.hoveringBehaviour = 'ALWAYS_VISIBLE';
//       break;
//     case 'NEVER_SHOW':
//       _obj.behaviourParams.item.overlay.hoveringBehaviour = 'NEVER_VISIBLE';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
// function process_old_to_new_InfoPlacement(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'titlePlacement',
//     optionsMap.layoutParams.info.placement
//   );
//   switch (_obj.layoutParams.info.placement) {
//     case 'SHOW_ON_HOVER':
//       _obj.layoutParams.info.placement = 'OVERLAY';
//       break;
//     case 'SHOW_BELOW':
//       _obj.layoutParams.info.placement = 'BELOW';
//       break;
//     case 'SHOW_ABOVE':
//       _obj.layoutParams.info.placement = 'ABOVE';
//       break;
//     case 'SHOW_ON_THE_RIGHT':
//       _obj.layoutParams.info.placement = 'RIGHT';
//       break;
//     case 'SHOW_ON_THE_LEFT':
//       _obj.layoutParams.info.placement = 'LEFT';
//       break;
//     case 'ALTERNATE_HORIZONTAL':
//       _obj.layoutParams.info.placement = 'ALTERNATE_HORIZONTALLY';
//       break;
//     case 'ALTERNATE_VERTICAL':
//       _obj.layoutParams.info.placement = 'ALTERNATE_VERTICALLY';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
// function process_old_to_new_ClickAction(obj) {
//   let _obj = { ...obj };
//   _obj = namingChange(
//     _obj,
//     'itemClick',
//     optionsMap.behaviourParams.item.clickAction
//   );
//   _obj.behaviourParams.item.clickAction =
//     _obj.behaviourParams.item.clickAction.toUpperCase();
//   switch (_obj.behaviourParams.item.clickAction) {
//     case 'FULLSCREEN':
//     case 'EXPAND':
//       _obj.behaviourParams.item.clickAction = 'ACTION';
//       break;
//     default:
//       break;
//   }
//   return _obj;
// }
// function process_old_to_new_AutoSlideBehaviour(obj) {
//   let _obj = { ...obj };
//   let isAutoSlide = _obj.isAutoSlideshow;
//   let autoSlideshowType = _obj.autoSlideshowType;
//   let finalVal;
//   if (!isAutoSlide) {
//     finalVal = 'OFF';
//   } else {
//     if (autoSlideshowType === 'interval') {
//       finalVal = 'INTERVAL';
//     } else {
//       finalVal = 'CONTINUOUS';
//     }
//   }
//   _obj = assignByString(
//     _obj,
//     optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour,
//     finalVal
//   );
//   delete _obj.isAutoSlideshow;
//   delete _obj.autoSlideshowType;
//   return _obj;
// }
// function process_old_to_new_CropRatio(obj) {
//   let _obj = { ...obj };
//   //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
//   let repeatingVal = obj.rotatingCropRatios;
//   let val = obj.cubeRatio || obj.layoutParams?.cropRatio;

//   let finalVal;
//   if (typeof repeatingVal === 'string' && repeatingVal !== '') {
//     finalVal = repeatingVal;
//   } else {
//     finalVal = val;
//   }
//   _obj.layoutParams.cropRatio = finalVal;
//   delete _obj.cropRatio;
//   delete _obj.rotatingCropRatios;
//   return _obj;
// }
// function process_old_to_new_GroupTypes(obj) {
//   let _obj = { ...obj };
//   //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
//   let repeatingVal =
//     obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
//   let val = obj.groupTypes;
//   let finalVal;
//   if (typeof repeatingVal === 'string' && repeatingVal !== '') {
//     finalVal = repeatingVal;
//   } else {
//     finalVal = val;
//   }
//   _obj.layoutParams.groupTypes = finalVal;
//   delete _obj.layoutParams.repeatingGroupTypes;
//   delete _obj.groupTypes;
//   delete _obj.repeatingGroupTypes;
//   return _obj;
// }
// function process_old_to_new_NumberOfColumns(obj) {
//   let _obj = { ...obj };
//   let fixedColumns = obj.fixedColumns;
//   let numberOfImagesPerRow = obj.numberOfImagesPerRow;
//   let numberOfGroupsPerRow = obj.groupsPerStrip;
//   let finalVal = fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow;

//   _obj.layoutParams.numberOfColumns = finalVal;
//   delete _obj.fixedColumns;
//   delete _obj.numberOfImagesPerRow;
//   delete _obj.groupsPerStrip;
//   return _obj;
// }

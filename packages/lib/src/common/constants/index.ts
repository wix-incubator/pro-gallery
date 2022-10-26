import arrowsPosition from './arrowsPosition';
import arrowsVerticalPosition from './arrowsVerticalPosition';
import cubeType from './cubeType';
import dimensions from './dimensions';
import events from './events';
import deviceType from './deviceType';
import gallerySizeType from './gallerySizeType';
import galleryTextAlign from './galleryTextAlign';
import gridStyle from './gridStyle';
import cubeFitPosition from './cubeFitPosition';
import groupTypes from './groupTypes';
import imageHoverAnimations from './imageHoverAnimations';
import infoBehaviourOnHover from './infoBehaviourOnHover';
import infoType from './infoType';
import isVertical from './isVertical';
import itemClick from './itemClick';
import layout, { isLayout } from './layout';
import layoutDirection from './layoutDirection';
import loadingMode from './loadingMode';
import loadingWithColorMode from './loadingWithColorMode';
import loadMoreAmount from './loadMoreAmount';
import mobileSwipeAnimations from './mobileSwipeAnimations';
import overlayAnimations from './overlayAnimations';
import placements, {
  hasExternalAbovePlacement,
  hasExternalBelowPlacement,
  hasHoverPlacement,
  hasExternalRightPlacement,
  hasExternalLeftPlacement,
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
  isExternalAbovePlacement,
  isExternalBelowPlacement,
  isHoverPlacement,
  isExternalRightPlacement,
  isExternalLeftPlacement,
  isExternalVerticalPlacement,
  isExternalHorizontalPlacement,
  isConstantVerticalPlacement,
} from './placements';
import resizeMethods from './resizeMethods';
import scrollAnimations from './scrollAnimations';
import slideAnimations from './slideAnimations';
import scrollDirection from './scrollDirection';
import socialNetworks from './socialNetworks';
import textBoxWidthCalculationOptions from './textBoxWidthCalculationOptions';
import thumbnailsAlignment from './thumbnailsAlignment';
import thumbnailsPosition from './thumbnailsPosition';
import { URL_SIZES as urlSizes, URL_TYPES as urlTypes } from './urlTypes';
import videoPlay from './videoPlay';
import viewMode from './viewMode';
import imagePlacementAnimations from './imagePlacementAnimations';
import slideTransition from './slideTransition';
import overlayPositions from './overlayPositions';
import overlaySizeType from './overlaySizeType';
import autoSlideshowTypes from './autoSlideshowTypes';
import arrowsType from './arrowsType';
import arrowsContainerStyleType from './arrowsContainerStyleType';
import itemResolutionMode from './itemResolutionMode';
import autoSlideBehaviour from './autoSlideBehaviour';
import secondaryMediaTrigger from './secondaryMediaTrigger';
import secondaryMediaBehaviour from './secondaryMediaBehaviour';
//NEW STYPEPARAMS METHOD
import layoutParams_crop_method from './layoutParams_crop_method';
import layoutParams_crop_alignment from './layoutParams_crop_alignment';
import layoutParams_structure_galleryLayout from './layoutParams_structure_galleryLayout';
import layoutParams_structure_groupsOrder from './layoutParams_structure_groupsOrder';
import layoutParams_structure_layoutOrientation from './layoutParams_structure_layoutOrientation';
import layoutParams_structure_responsiveMode from './layoutParams_structure_responsiveMode';
import layoutParams_structure_scrollDirection from './layoutParams_structure_scrollDirection';
import layoutParams_thumbnails_alignment from './layoutParams_thumbnails_alignment';

import layoutParams_navigationArrows_verticalAlignment from './layoutParams_navigationArrows_verticalAlignment';
import layoutParams_navigationArrows_position from './layoutParams_navigationArrows_position';

import layoutParams_info_layout from './layoutParams_info_layout';
import layoutParams_info_sizeUnits from './layoutParams_info_sizeUnits';

import layoutParams_targetItemSize_unit from './layoutParams_targetItemSize_unit';

import behaviourParams_item_clickAction from './behaviourParams_item_clickAction';
import behaviourParams_item_video_playTrigger from './behaviourParams_item_video_playTrigger';
import behaviourParams_item_overlay_hoveringBehaviour from './behaviourParams_item_overlay_hoveringBehaviour';
import behaviourParams_item_overlay_hoverAnimation from './behaviourParams_item_overlay_hoverAnimation';
import behaviourParams_item_overlay_position from './behaviourParams_item_overlay_position';
import behaviourParams_item_overlay_sizeUnits from './behaviourParams_item_overlay_sizeUnits';
import behaviourParams_item_content_hoverAnimation from './behaviourParams_item_content_hoverAnimation';
import behaviourParams_item_content_placementAnimation from './behaviourParams_item_content_placementAnimation';
import behaviourParams_item_content_loader from './behaviourParams_item_content_loader';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_clickAction';
import behaviourParams_item_secondaryMedia_behaviour from './behaviourParams_item_clickAction';
//NEW STYPEPARAMS METHOD

export default {
  arrowsPosition,
  itemResolutionMode,
  arrowsVerticalPosition,
  cubeType,
  dimensions,
  events,
  deviceType,
  gallerySizeType,
  galleryTextAlign,
  gridStyle,
  cubeFitPosition,
  groupTypes,
  imageHoverAnimations,
  infoBehaviourOnHover,
  infoType,
  isVertical,
  itemClick,
  layout,
  isLayout,
  layoutDirection,
  loadingMode,
  loadingWithColorMode,
  loadMoreAmount,
  mobileSwipeAnimations,
  overlayAnimations,
  placements,
  hasExternalAbovePlacement,
  hasExternalBelowPlacement,
  hasHoverPlacement,
  hasExternalRightPlacement,
  hasExternalLeftPlacement,
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
  isExternalAbovePlacement,
  isExternalBelowPlacement,
  isHoverPlacement,
  isExternalRightPlacement,
  isExternalLeftPlacement,
  isExternalVerticalPlacement,
  isExternalHorizontalPlacement,
  isConstantVerticalPlacement,
  resizeMethods,
  scrollAnimations,
  slideAnimations,
  scrollDirection,
  socialNetworks,
  textBoxWidthCalculationOptions,
  thumbnailsAlignment,
  thumbnailsPosition,
  urlSizes,
  urlTypes,
  videoPlay,
  viewMode,
  imagePlacementAnimations,
  slideTransition,
  overlayPositions,
  overlaySizeType,
  autoSlideshowTypes,
  arrowsType,
  arrowsContainerStyleType,
  autoSlideBehaviour,
  secondaryMediaTrigger,
  secondaryMediaBehaviour,

  //NEW STYPEPARAMS METHOD
  layoutParams_crop_method,
  layoutParams_crop_alignment,
  layoutParams_structure_galleryLayout,
  layoutParams_structure_groupsOrder,
  layoutParams_structure_layoutOrientation,
  layoutParams_structure_responsiveMode,
  layoutParams_structure_scrollDirection,
  layoutParams_thumbnails_alignment,
  layoutParams_navigationArrows_verticalAlignment,
  layoutParams_navigationArrows_position,
  layoutParams_info_layout,
  layoutParams_info_sizeUnits,
  layoutParams_targetItemSize_unit,
  behaviourParams_item_clickAction,
  behaviourParams_item_video_playTrigger,
  behaviourParams_item_overlay_hoveringBehaviour,
  behaviourParams_item_overlay_hoverAnimation,
  behaviourParams_item_overlay_position,
  behaviourParams_item_overlay_sizeUnits,
  behaviourParams_item_content_hoverAnimation,
  behaviourParams_item_content_placementAnimation,
  behaviourParams_item_content_loader,
  behaviourParams_item_secondaryMedia_trigger,
  behaviourParams_item_secondaryMedia_behaviour,
  //NEW STYPEPARAMS METHOD
};

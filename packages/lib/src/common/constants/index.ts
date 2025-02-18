import viewMode from './viewMode.js';
import { URL_SIZES as urlSizes, URL_TYPES as urlTypes } from './urlTypes.js';
import socialNetworks from './socialNetworks.js';
import resizeMethods from './resizeMethods.js';
import deviceType from './deviceType.js';
import events from './events.js';

import layoutParams_crop_method from './layoutParams_crop_method.js';
import layoutParams_crop_alignment from './layoutParams_crop_alignment.js';
import layoutParams_structure_galleryLayout, { isLayout } from './layoutParams_structure_galleryLayout.js';
import layoutParams_structure_groupsOrder from './layoutParams_structure_groupsOrder.js';
import layoutParams_structure_layoutOrientation from './layoutParams_structure_layoutOrientation.js';
import layoutParams_structure_responsiveMode from './layoutParams_structure_responsiveMode.js';
import layoutParams_structure_scrollDirection from './layoutParams_structure_scrollDirection.js';
import layoutParams_groups_allowedGroupTypes from './layoutParams_groups_allowedGroupTypes.js';
import layoutParams_thumbnails_alignment from './layoutParams_thumbnails_alignment.js';

import layoutParams_navigationArrows_verticalAlignment from './layoutParams_navigationArrows_verticalAlignment.js';
import layoutParams_navigationArrows_position from './layoutParams_navigationArrows_position.js';
import layoutParams_navigationArrows_type from './layoutParams_navigationArrows_type.js';
import layoutParams_navigationArrows_container_type from './layoutParams_navigationArrows_container_type.js';

import layoutParams_info_layout from './layoutParams_info_layout.js';
import layoutParams_info_sizeUnits from './layoutParams_info_sizeUnits.js';
import layoutParams_info_placement, {
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
} from './layoutParams_info_placement.js';

import layoutParams_targetItemSize_unit from './layoutParams_targetItemSize_unit.js';

import behaviourParams_item_clickAction from './behaviourParams_item_clickAction.js';
import playTrigger from './playTrigger.js';
import behaviourParams_item_overlay_hoveringBehaviour from './behaviourParams_item_overlay_hoveringBehaviour.js';
import behaviourParams_item_overlay_hoverAnimation from './behaviourParams_item_overlay_hoverAnimation.js';
import behaviourParams_item_overlay_position from './behaviourParams_item_overlay_position.js';
import behaviourParams_item_overlay_sizeUnits from './behaviourParams_item_overlay_sizeUnits.js';
import behaviourParams_item_content_hoverAnimation from './behaviourParams_item_content_hoverAnimation.js';
import behaviourParams_item_content_placementAnimation from './behaviourParams_item_content_placementAnimation.js';
import behaviourParams_item_content_loader from './behaviourParams_item_content_loader.js';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_secondaryMedia_trigger.js';
import behaviourParams_item_secondaryMedia_behaviour from './behaviourParams_item_secondaryMedia_behaviour.js';
import behaviourParams_gallery_layoutDirection from './behaviourParams_gallery_layoutDirection.js';
import behaviourParams_gallery_scrollAnimation from './behaviourParams_gallery_scrollAnimation.js';
import behaviourParams_gallery_vertical_loadMore_amount from './behaviourParams_gallery_vertical_loadMore_amount.js';
import behaviourParams_gallery_horizontal_slideAnimation from './behaviourParams_gallery_horizontal_slideAnimation.js';
import behaviourParams_gallery_horizontal_slideTransition from './behaviourParams_gallery_horizontal_slideTransition.js';
import behaviourParams_gallery_horizontal_autoSlide_behaviour from './behaviourParams_gallery_horizontal_autoSlide_behaviour.js';
import behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment from './behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment.js';
import stylingParams_itemResolutionMode from './stylingParams_itemResolutionMode.js';
import layoutParams_thumbnails_position from './layoutParams_thumbnails_position.js';
import { parse3DDimensions } from './behaviourParams_item_threeDimensionalScene_controls.js';

//NEW STYPEPARAMS METHOD

export default {
  events,
  deviceType,
  isLayout,
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

  socialNetworks,

  urlSizes,
  urlTypes,
  viewMode,

  layoutParams_crop_method,
  layoutParams_crop_alignment,
  layoutParams_structure_galleryLayout,
  layoutParams_structure_groupsOrder,
  layoutParams_structure_layoutOrientation,
  layoutParams_structure_responsiveMode,
  layoutParams_structure_scrollDirection,
  layoutParams_groups_allowedGroupTypes,
  layoutParams_thumbnails_alignment,
  layoutParams_navigationArrows_verticalAlignment,
  layoutParams_navigationArrows_position,
  layoutParams_navigationArrows_type,
  layoutParams_navigationArrows_container_type,
  layoutParams_info_layout,
  layoutParams_info_sizeUnits,
  layoutParams_info_placement,
  layoutParams_targetItemSize_unit,
  behaviourParams_item_clickAction,
  behaviourParams_item_video_playTrigger: playTrigger,
  behaviourParams_item_overlay_hoveringBehaviour,
  behaviourParams_item_overlay_hoverAnimation,
  behaviourParams_item_overlay_position,
  behaviourParams_item_overlay_sizeUnits,
  behaviourParams_item_content_hoverAnimation,
  behaviourParams_item_content_placementAnimation,
  behaviourParams_item_content_loader,
  behaviourParams_item_secondaryMedia_trigger,
  behaviourParams_item_secondaryMedia_behaviour,
  behaviourParams_gallery_layoutDirection,
  behaviourParams_gallery_scrollAnimation,
  behaviourParams_gallery_vertical_loadMore_amount,
  behaviourParams_gallery_horizontal_slideAnimation,
  behaviourParams_gallery_horizontal_slideTransition,
  behaviourParams_gallery_horizontal_autoSlide_behaviour,
  behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment,
  behaviourParams_item_threeDimensionalScene_playTrigger: playTrigger,
  parse3DDimensions,
  stylingParams_itemResolutionMode,
  layoutParams_thumbnails_position,
  //NEW STYPEPARAMS METHOD
};

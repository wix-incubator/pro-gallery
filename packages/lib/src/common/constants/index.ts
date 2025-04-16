import viewMode from './viewMode';
import { URL_SIZES as urlSizes, URL_TYPES as urlTypes } from './urlTypes';
import socialNetworks from './socialNetworks';
import resizeMethods from './resizeMethods';
import deviceType from './deviceType';
import events from './events';

import layoutParams_crop_method from './layoutParams_crop_method';
import layoutParams_crop_alignment from './layoutParams_crop_alignment';
import layoutParams_structure_galleryLayout, { isLayout } from './layoutParams_structure_galleryLayout';
import layoutParams_structure_groupsOrder from './layoutParams_structure_groupsOrder';
import layoutParams_structure_layoutOrientation from './layoutParams_structure_layoutOrientation';
import layoutParams_structure_responsiveMode from './layoutParams_structure_responsiveMode';
import layoutParams_structure_scrollDirection from './layoutParams_structure_scrollDirection';
import layoutParams_groups_allowedGroupTypes from './layoutParams_groups_allowedGroupTypes';
import layoutParams_thumbnails_alignment from './layoutParams_thumbnails_alignment';

import layoutParams_navigationArrows_verticalAlignment from './layoutParams_navigationArrows_verticalAlignment';
import layoutParams_navigationArrows_position from './layoutParams_navigationArrows_position';
import layoutParams_navigationArrows_type from './layoutParams_navigationArrows_type';
import layoutParams_navigationArrows_container_type from './layoutParams_navigationArrows_container_type';

import layoutParams_info_layout from './layoutParams_info_layout';
import layoutParams_info_sizeUnits from './layoutParams_info_sizeUnits';
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
} from './layoutParams_info_placement';

import layoutParams_targetItemSize_unit from './layoutParams_targetItemSize_unit';

import behaviourParams_item_clickAction from './behaviourParams_item_clickAction';
import playTrigger from './playTrigger';
import behaviourParams_item_overlay_hoveringBehaviour from './behaviourParams_item_overlay_hoveringBehaviour';
import behaviourParams_item_overlay_hoverAnimation from './behaviourParams_item_overlay_hoverAnimation';
import behaviourParams_item_overlay_position from './behaviourParams_item_overlay_position';
import behaviourParams_item_overlay_sizeUnits from './behaviourParams_item_overlay_sizeUnits';
import behaviourParams_item_content_hoverAnimation from './behaviourParams_item_content_hoverAnimation';
import behaviourParams_item_content_placementAnimation from './behaviourParams_item_content_placementAnimation';
import behaviourParams_item_content_loader from './behaviourParams_item_content_loader';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_secondaryMedia_trigger';
import behaviourParams_item_secondaryMedia_behaviour from './behaviourParams_item_secondaryMedia_behaviour';
import behaviourParams_gallery_layoutDirection from './behaviourParams_gallery_layoutDirection';
import behaviourParams_gallery_scrollAnimation from './behaviourParams_gallery_scrollAnimation';
import behaviourParams_gallery_vertical_loadMore_amount from './behaviourParams_gallery_vertical_loadMore_amount';
import behaviourParams_gallery_horizontal_slideAnimation from './behaviourParams_gallery_horizontal_slideAnimation';
import behaviourParams_gallery_horizontal_slideTransition from './behaviourParams_gallery_horizontal_slideTransition';
import behaviourParams_gallery_horizontal_autoSlide_behaviour from './behaviourParams_gallery_horizontal_autoSlide_behaviour';
import behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment from './behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment';
import stylingParams_itemResolutionMode from './stylingParams_itemResolutionMode';
import layoutParams_thumbnails_position from './layoutParams_thumbnails_position';
import { parse3DDimensions } from './behaviourParams_item_threeDimensionalScene_controls';

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

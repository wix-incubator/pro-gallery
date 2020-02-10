import React from 'react';
import PropTypes from 'prop-types';
import consts from '../../../common/constants';

export const basePropTypes = {
  domId: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  container: PropTypes.object.isRequired,

  scrollingElement: PropTypes.any,
  options: PropTypes.object,
  eventsListener: PropTypes.function,
  totalItemsCount: PropTypes.number,
  resizeMediaUrl: PropTypes.function,
};

export const baseLayoutPropTypes = {
  orientaion: PropTypes.oneOf(['rows', 'cols']),
  rtl: PropTypes.bool,
  spacing: PropTypes.number,
  scrollDirection: PropTypes.oneOf(['vertical', 'horizontal']),
  itemSize: PropTypes.number,
  info: PropTypes.oneOf(['above', 'below', 'hover', 'none']),
  play: PropTypes.oneOf(['auto', 'hover', 'onClick']),
  overlayAnimation: PropTypes.oneOf(consts.overlayAnimations),
  imageHoverAnimation: PropTypes.oneOf(consts.imageHoverAnimations),
  scrollAnimation: PropTypes.oneOf(consts.scrollAnimations),
  hoveringBehaviour: PropTypes.oneOf(consts.hoveringBehaviours),
  loop: PropTypes.bool, //slideshowLoop
  autoSlide: PropTypes.number, //isAutoSlideshow && autoSlideshowInterval
  itemsPerCol: PropTypes.number
  // cropType,
  // cropRatio,
}

export const LAYOUT_PROPS = Object.keys(baseLayoutPropTypes).reduce((layoutProps, prop) => ({...layoutProps, [prop]:prop}), {});

export const layoutPropTypes = layoutProps => ({
  ...basePropTypes,
  ...layoutProps.reduce((resPropTypes, prop) => ({...resPropTypes, [prop]: baseLayoutPropTypes[prop]}), {})
})

export const propsToStyles = props => ({
  ...(props.spacing && {imageMargin: props.spacing}),
  ...(props.rtl && {isRTL: props.rtl}),
  ...(props.orientation && {isVertical: props.orientation === 'cols'}),
  ...(props.scrollDirection && {oneRow: props.scrollDirection === 'horizontal'}),
  ...(props.itemSize && {gallerySizeType: props.itemSize > 0 ? 'px' : 'smart'}),
  ...(props.itemSize && {gallerySizePx: props.itemSize}),
  ...(props.info && {allowHover: props.info === 'hover'}),
  ...(props.play && {videoPlay: props.play}),
  ...(props.overlayAnimation && {overlayAnimation: props.overlayAnimation}),
  ...(props.imageHoverAnimation && {imageHoverAnimation: props.imageHoverAnimation}),
  ...(props.scrollAnimation && {scrollAnimation: props.scrollAnimation}),
  ...(props.hoveringBehaviour && {hoveringBehaviour: props.hoveringBehaviour}),
  ...props.styles,
})

import React from 'react';
import PropTypes from 'prop-types';
import consts from '../../../common/constants';
import basePropTypes from '../proGallery/propTypes';

const basePropTypes = {
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
  // cropType,
  // cropRatio,
  loop: PropTypes.bool, //slideshowLoop
  autoSlide: PropTypes.number, //isAutoSlideshow && autoSlideshowInterval
  itemsPerCol: PropTypes.number

}

export const layoutPropTypes = props => {
  return {
    ...basePropTypes,
    ...props.reduce((resPropTypes, prop) => resPropTypes[prop] = basePropTypes[prop], {})
  }
}

export const propsToStyles = props => {
  return {
    ...props.styles,
    imageMargin: props.spacing,
    isRTL: props.rtl,
    isVertical: props.orientation === 'cols',
    oneRow: props.scrollDirection === 'horizontal',
    gallerySizeType: props.itemSize > 0 ? 'px' : 'smart',
    gallerySizePx: props.itemSize,
    allowHover: props.info === 'hover',
    videoPlay: props.play,
    overlayAnimation: props.overlayAnimation,
    imageHoverAnimation: props.imageHoverAnimation,
    scrollAnimation: props.scrollAnimation,
    hoveringBehaviour: props.hoveringBehaviour,
  }
}


import React from 'react';
import PropTypes from 'prop-types';
import ProGallery from '../proGallery/proGallery';
import basePropTypes from '../proGallery/propTypes';
import LAYOUTS from '../../../common/constants/layout';
import consts from '../../../common/constants';

export const layoutStyles = {
  galleryLayout: LAYOUTS.COLLAGE,

  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  cubeImages: false,
  groupSize: 3,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  gallerySize: 0,
  fixedColumns: 0,
  hasThumbnails: false,
  enableScroll: true,
  isGrid: false,
  isSlider: false,
  isMasonry: false,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
}

export const layoutPropTypes = {
  orientaion: PropTypes.oneOf(['rows', 'cols']),
  rtl: PropTypes.bool,
  spacing: PropTypes.number,
  scrollDirection: PropTypes.oneOf(['vertical', 'horizontal']),
  itemSize: PropTypes.number,
  info: PropTypes.oneOf(['above', 'below', 'hover', 'none']),
  play: PropTypes.oneOf(['auto', 'hover','onClick']),
  overlayAnimation: PropTypes.oneOf(consts.overlayAnimations),
  imageHoverAnimation: PropTypes.oneOf(consts.imageHoverAnimations),
  scrollAnimation: PropTypes.oneOf(consts.scrollAnimations),
  hoveringBehaviour: PropTypes.oneOf(consts.hoveringBehaviours),
}

export const propsToStyles = props => {
  return {
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

export default class CollageGallery extends React.Component {


  static propTypes = {
    ...basePropTypes,
    ...layoutPropTypes
  }

  createStyles = () => {
    const { styles } = this.props;
    const layoutProps = Object.keys(layoutPropTypes).reduce((props, propType) => {
      if (typeof styles[propType] !== 'undefined') { 
        props[propType] = styles[propType];
      }
    }, {});
    const gallerySize = Math.round(styles.gallerySize * 5 + 500);

    return {
      ...styles,
      ...layoutProps,
      ...layoutStyles,
      gallerySize
    }
  }

  render() {

    return (
      <ProGallery
        {...this.props}
        styles={
          this.createStyles()
        }
      />
    );
  }
}

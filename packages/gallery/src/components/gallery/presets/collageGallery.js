
import React from 'react';
import PropTypes from 'prop-types';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import basePropTypes from '../proGallery/propTypes';
import PLACEMENTS from '../../../common/constants/placements';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLLAGE,
  cubeImages: false,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  groupSize: 3,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
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

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    gallerySize: styles.modifiedGallerySize ? styles.gallerySize : Math.round(styles.gallerySize * 5 + 500),
    modifiedGallerySize: true
  }
}

export default class CollageGallery extends React.Component {

  static propTypes = {
    ...basePropTypes,

    isVertical: PropTypes.bool,
    isRTL: PropTypes.bool,
    imageMargin: PropTypes.number
  }

  render() {

    return (
      <ProGallery
        {...this.props}
        styles={
          createStyles(this.props.styles)
        }
      />
    );
  }
}


import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLLAGE,
  cubeImages: false,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
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
export default class CollageGallery extends React.Component {

  createStyles = () => {
    return {
      ...this.props.styles,
      ...fixedStyles,
      gallerySize: Math.round(this.props.styles.gallerySize * 5 + 500),
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

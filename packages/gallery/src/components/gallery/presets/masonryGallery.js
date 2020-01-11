
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.MASONRY,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  cubeImages: false,
  groupSize: 1,
  groupTypes: '1',
  gallerySize: 0,
  fixedColumns: 0,
  hasThumbnails: false,
  enableScroll: true,
  isGrid: false,
  isSlider: false,
  isMasonry: true,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
  oneRow: false,
}
export default class MasonryGallery extends React.Component {

  createStyles = () => {
    return {
      ...this.props.styles,
      ...layoutStyles,
      gallerySize: this.props.styles.gallerySize,
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

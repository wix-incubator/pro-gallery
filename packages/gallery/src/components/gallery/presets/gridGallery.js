import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.GRID,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  cubeImages: true,
  smartCrop: false,
  isVertical: true,
  galleryType: 'Columns',
  groupSize: 1,
  groupTypes: '1',
  fixedColumns: 0,
  gallerySize: 0,
  hasThumbnails: false,
  enableScroll: true,
  cropOnlyFill: false,
  isSlider: false,
  isColumns: false,
  isGrid: true,
  isMasonry: false,
  isSlideshow: false,
  minItemSize: 50,
}
export default class GridGallery extends React.Component {

  createStyles = () => {
    return {
      ...this.props.styles,
      ...layoutStyles,
      gallerySize: Math.round(this.props.styles.gallerySize * 8.5 + 150),
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

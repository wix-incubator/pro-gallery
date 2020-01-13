import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.SLIDESHOW,
  enableInfiniteScroll: true,
  allowHover: false,
  cubeRatio: '100%/100%',
  cubeImages: true,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  smartCrop: false,
  isVertical: false,
  gallerySize: 550,
  galleryType: 'Strips',
  groupSize: 1,
  groupTypes: '1',
  fixedColumns: 1,
  oneRow: true,
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isColumns: false,
  isMasonry: false,
  isSlider: false,
  isSlideshow: true,
  cropOnlyFill: false,
  floatingImages: 0,
  galleryMargin: 0,
  imageMargin: 0,
}
export default class SlideshowGallery extends React.Component {

  createStyles = () => {
    return {
      ...this.props.styles,
      ...layoutStyles,
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

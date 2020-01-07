import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.SLIDESHOW,
  enableInfiniteScroll: true,
  allowHover: false,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  cubeImages: true,
  smartCrop: false,
  cubeRatio: '100%/100%',
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
      ...fixedStyles,
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

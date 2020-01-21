import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import isEligibleForLeanGallery from '../leanGallery/isEligible';
import LeanGallery from '../leanGallery/leanGallery';

export const fixedStyles = {
  galleryLayout: LAYOUTS.GRID,
  cubeImages: true,
  isVertical: true,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  smartCrop: false,
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
      ...fixedStyles,
      gallerySize: Math.round(this.props.styles.gallerySize * 8.5 + 150),
    }
  }

  render() {

    const props = {...this.props, styles: this.createStyles()};

    let GalleryComponent = ProGallery;
    if (isEligibleForLeanGallery(props)) {
      GalleryComponent = LeanGallery;
    }

    return (
      <GalleryComponent
        {...props}
      />
    );
  }
}

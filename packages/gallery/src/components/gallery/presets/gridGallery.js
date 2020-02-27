import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import isEligibleForLeanGallery from '../leanGallery/isEligible';
import LeanGallery from '../leanGallery/leanGallery';

export const fixedStyles = {
  galleryLayout: LAYOUTS.GRID,
  cubeImages: true,
  isVertical: true,
  groupSize: 1,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  smartCrop: false,
  galleryType: 'Columns',
  groupTypes: '1',
  fixedColumns: 0,
  gallerySize: 0,
  enableScroll: true,
  cropOnlyFill: false,
  isSlider: false,
  isColumns: false,
  isGrid: true,
  isMasonry: false,
  isSlideshow: false,
  minItemSize: 50,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    gallerySize: styles.modifiedGallerySize ? styles.gallerySize : Math.round(styles.gallerySize * 8.5 + 150),
    modifiedGallerySize: true
  }
}

export default class GridGallery extends React.Component {

  render() {

    const props = {...this.props, styles: createStyles(this.props.styles)};

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

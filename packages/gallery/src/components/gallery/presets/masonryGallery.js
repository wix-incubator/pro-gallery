
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.MASONRY,
  cubeImages: false,
  scrollDirection: SCROLL_DIRECTION.VERTICAL,
  groupSize: 1,
  groupTypes: '1',
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: false,
  gallerySize: 0,
  fixedColumns: 0,
  enableScroll: true,
  isGrid: false,
  isSlider: false,
  isMasonry: true,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
  oneRow: false,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    gallerySize: styles.gallerySize,
  }
}
export default class MasonryGallery extends React.Component {


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

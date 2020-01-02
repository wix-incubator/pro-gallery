
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.MASONRY,
  //params from layoutHelper
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

  render() {

    return (
      <ProGallery
        {...this.props}
        styles={{
          ...this.props.styles,
          ...fixedStyles,
          gallerySize: this.props.styles.gallerySize
        }}
      />
    );
  }
}

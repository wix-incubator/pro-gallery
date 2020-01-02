import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.GRID,
  //params from layoutHelper
  showArrows: false,
  cubeImages: true,
  smartCrop: false,
  isVertical: true,
  galleryType: 'Columns',
  groupSize: 1,
  groupTypes: '1',
  fixedColumns: undefined,
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

  render() {
    return (
      <ProGallery
        {...this.props}
        styles={{
          ...this.props.styles,
          ...fixedStyles,
          gallerySize: Math.round(this.props.styles.gallerySize * 8.5 + 150)
        }}
      />
    );
  }
}

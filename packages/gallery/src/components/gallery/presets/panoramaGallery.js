
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.PANORAMA,
  //params from layoutHelper
  showArrows: false,
  cubeImages: false,
  isVertical: true,
  galleryType: 'Columns',
  groupSize: 1,
  groupTypes: '1',
  gallerySize: () => dimensionsHelper.getGalleryWidth(),
  oneRow: false,
  fixedColumns: 1,
  hasThumbnails: false,
  enableScroll: true,
  isGrid: false,
  isColumns: false,
  isMasonry: false,
  isSlider: false,
  isSlideshow: false,
  cropOnlyFill: false,
  slideshowLoop: false,
}
export default class PanoramaGallery extends React.Component {
  render() {
    return (
      <ProGallery
        {...this.props}
        styles={{
          ...this.props.styles,
          ...fixedStyles
        }}
      />
    );
  }
}

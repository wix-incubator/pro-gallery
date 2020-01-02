
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.THUMBNAIL,
  enableInfiniteScroll: true,
  //params from layoutHelper
  showArrows: true,
  cubeImages: true,
  smartCrop: false,
  cubeRatio: '100%/100%',
  isVertical: false,
  galleryType: 'Strips',
  groupSize: 1,
  gallerySize: () => dimensionsHelper.getGalleryWidth(),
  groupTypes: '1',
  oneRow: true,
  hasThumbnails: true,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: false,
  isMasonry: false,
  isColumns: false,
  isSlideshow: false,
  cropOnlyFill: false,
  floatingImages: 0,
  galleryMargin: 0,
  imageMargin: 0,
}
export default class ThumbnailGallery extends React.Component {
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

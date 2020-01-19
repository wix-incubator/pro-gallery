
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.THUMBNAIL,
  enableInfiniteScroll: true,
  cubeRatio: '100%/100%',
  cubeImages:true,
  oneRow: true,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  smartCrop: false,
  isVertical: false,
  galleryType: 'Strips',
  groupSize: 1,
  gallerySize: () => dimensionsHelper.getGalleryWidth(),
  groupTypes: '1',
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

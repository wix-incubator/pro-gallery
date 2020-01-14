
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';
import PLACEMENTS from '../../../common/constants/placements';

export const fixedStyles = {
  galleryLayout: LAYOUTS.FULLSIZE,
  cubeImages: true,
  cubeRatio: '100%/100%',
  cubeType: 'fill',
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  smartCrop: false,
  isVertical: false,
  galleryType: 'Strips',
  groupSize: 1,
  gallerySize: () => dimensionsHelper.getGalleryWidth(),
  groupTypes: '1',
  oneRow: true,
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: false,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  cropOnlyFill: false,
  floatingImages: 0,
  galleryMargin: 0,
  imageMargin: 0,
}
export default class FullsizeGallery extends React.Component {

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

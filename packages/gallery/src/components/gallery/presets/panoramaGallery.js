
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';

export const layoutStyles = {
  galleryLayout: LAYOUTS.PANORAMA,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
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

  createStyles = () => {
    return {
      ...this.props.styles,
      ...layoutStyles,
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

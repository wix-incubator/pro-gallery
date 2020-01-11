
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';

export const layoutStyles = {
  galleryLayout: LAYOUTS.COLUMN,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  cubeImages: true,
  smartCrop: false,
  cubeType: 'fill',
  cubeRatio: 0.35,
  isVertical: false,
  galleryType: 'Strips',
  groupSize: 1,
  groupTypes: '1',
  gallerySize: () => dimensionsHelper.getGalleryHeight(),
  fixedColumns: 0,
  hasThumbnails: false,
  oneRow: true,
  enableScroll: true,
  isGrid: false,
  isColumns: true,
  isMasonry: false,
  isSlider: false,
  isSlideshow: false,
  cropOnlyFill: false,
}
export default class ColumnGallery extends React.Component {
  
  createStyles = () =>{
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

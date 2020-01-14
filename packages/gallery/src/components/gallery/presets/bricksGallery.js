
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import PLACEMENTS from '../../../common/constants/placements';

export const fixedStyles = {
  galleryLayout: LAYOUTS.BRICKS,
  cubeType: 'fill',
  cubeImages: true,
  cubeRatio: 1,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  isVertical: true,
  gallerySize: 400,
  minItemSize: 50,
  groupSize: 3,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  rotatingGroupTypes: '2h',
  smartCrop: false,
  collageDensity: 0.8,
  galleryMargin: 0,
  floatingImages: 0,
  fixedColumns: 1,
  groupsPerStrip: 0,
  oneRow: false,
  placeGroupsLtr: false,
  rotatingCropRatios: '0.707,1.414,1.414,0.707',
}
export default class BricksGallery extends React.Component {

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


import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import PLACEMENTS from '../../../common/constants/placements';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.ALTERNATE,
  cubeType: 'fill',
  cubeImages: true,
  cubeRatio: 1,
  titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
  scrollDirection: SCROLL_DIRECTION.VERTICAL,
  galleryMargin: 0,
  isVertical: true,
  groupSize: 3,
  collageDensity: 0.48,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  gallerySize: 86,
  minItemSize: 50,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  rotatingGroupTypes: '1,2h,1,2h',
  smartCrop: false,
  floatingImages: 0,
  fixedColumns: 1,
  groupsPerStrip: 0,
  oneRow: false,
  placeGroupsLtr: false,
  rotatingCropRatios: '',
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
  }
}
export default class alternateGallery extends React.Component {

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


import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.ALTERNATE,

  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  isVertical: true,
  gallerySize: 86,
  minItemSize: 50,
  groupSize: 3,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  rotatingGroupTypes: '1,3l,1,3r',
  cubeImages: true,
  cubeType: 'fill',
  smartCrop: false,
  collageDensity: 0.48,
  galleryMargin: 0,
  floatingImages: 0,
  cubeRatio: 1,
  fixedColumns: 1,
  groupsPerStrip: 0,
  oneRow: false,
  placeGroupsLtr: false,
  rotatingCropRatios: '',
}
export default class alternateGallery extends React.Component {

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

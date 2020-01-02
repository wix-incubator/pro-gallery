
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.BRICKS,
  //params from layoutHelper
  sampleSize: 100,
  isVertical: true,
  gallerySize: 400,
  minItemSize: 50,
  groupSize: 3,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
  rotatingGroupTypes: '2h',
  cubeImages: true,
  cubeType: 'fill',
  smartCrop: false,
  collageDensity: 0.8,
  galleryMargin: 0,
  floatingImages: 0,
  cubeRatio: 1,
  fixedColumns: 1,
  groupsPerStrip: 0,
  oneRow: false,
  placeGroupsLtr: false,
  at: 1538487882356,
  rotatingCropRatios: '0.707,1.414,1.414,0.707',
}
export default class BricksGallery extends React.Component {

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

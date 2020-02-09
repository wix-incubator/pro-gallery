
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const layoutStyles = {
  //tested params
  galleryLayout: LAYOUTS.SLIDER,
  enableInfiniteScroll: true,
  cubeImages: true,
  oneRow: true,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  isVertical: false,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  smartCrop: false,
  galleryType: 'Strips',
  groupSize: 1,
  groupTypes: '1',
  gallerySize: () => dimensionsHelper.getGalleryHeight(),
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isSlider: true,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  cropOnlyFill: true,

}

export const createStyles = styles => {
  return {
    ...styles,
    ...layoutStyles,
  }
}

export default class SliderGallery extends React.Component {

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

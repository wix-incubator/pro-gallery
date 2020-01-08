
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import dimensionsHelper from '../../helpers/dimensionsHelper';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  //tested params
  galleryLayout: LAYOUTS.SLIDER,
  enableInfiniteScroll: true,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  cubeImages: true,
  smartCrop: false,
  isVertical: false,
  galleryType: 'Strips',
  groupSize: 1,
  groupTypes: '1',
  gallerySize: () => dimensionsHelper.getGalleryHeight(),
  oneRow: true,
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
export default class SliderGallery extends React.Component {

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

import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import INFO_BEHAVIOUR_ON_HOVER from '../../../common/constants/infoBehaviourOnHover';
import SCROLL_DIRECTION from '../../../common/constants/scrollDirection';

export const fixedStyles = {
  galleryLayout: LAYOUTS.SLIDESHOW,
  enableInfiniteScroll: true,
  cubeRatio: '100%/100%',
  cubeImages: true,
  oneRow: true,
  hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW,
  scrollDirection: SCROLL_DIRECTION.HORIZONTAL,
  galleryMargin: 0,
  isVertical: false,
  groupTypes: '1',
  
  //this params were moved from the presets in layoutHelper and were not tested and checked yet.
  showArrows: true,
  smartCrop: false,
  gallerySize: 550,
  galleryType: 'Strips',
  groupSize: 1,
  fixedColumns: 1,
  hasThumbnails: false,
  enableScroll: true,
  scrollSnap: true,
  isGrid: false,
  isColumns: false,
  isMasonry: false,
  isSlider: false,
  isSlideshow: true,
  cropOnlyFill: false,
  floatingImages: 0,
  imageMargin: 0,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
  }
}

export default class SlideshowGallery extends React.Component {

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

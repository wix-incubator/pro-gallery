import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import GALLERY_CONSTS from '../../../common/constants';

export const fixedStyles = {
  galleryLayout: LAYOUTS.SLIDESHOW,
  enableInfiniteScroll: true,
  allowHover: false,
  scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL
}
export default class SlideshowGallery extends React.Component {
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

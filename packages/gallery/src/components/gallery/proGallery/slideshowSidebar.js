import React, { Component } from 'react';
import { GalleryComponent } from '../../galleryComponent';
import { GALLERY_CONSTS } from 'pro-gallery-lib'

class SlideshowSidebar extends GalleryComponent {
  constructor(props) {
    super(props);
  }
  shouldHaveSideInfo() {
    return this.props.styleParams.slideshowInfoPlacement === GALLERY_CONSTS.slideshowInfoPlacement.ON_THE_RIGHT
  }

  render() {
    console.log(this.props.styleParams);
    const customSidebarStyles = {
      width: this.props.styleParams.slideshowInfoWidth,
      height: '100%',
      padding: '130px 10px 0',
      position: 'absolute',
      right:0,
      boxSizing: 'border-box',
    }

    
    const item = this.props.items[this.props.currentIndex];
    const { customSlideshowInfoRenderer } = this.props;
    const slideshowInfo = customSlideshowInfoRenderer
        ? customSlideshowInfoRenderer({...this.props,...item.renderProps(), isMobile: false}) : null;
    if (!this.shouldHaveSideInfo()) {
      return null;
    }
    return (
      <div style={customSidebarStyles}>
        {slideshowInfo}
      </div>
    )
  }
}

export default SlideshowSidebar;

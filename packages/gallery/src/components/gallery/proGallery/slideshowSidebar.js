import React, { Component } from 'react';
import { GalleryComponent } from '../../galleryComponent';

class SlideshowSidebar extends GalleryComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const customSidebarStyles = {
      width: 300,
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

    return (
      <div style={customSidebarStyles}>
        {slideshowInfo}
      </div>
    )
  }
}

export default SlideshowSidebar;

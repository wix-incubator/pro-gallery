
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.EMPTY,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...layoutStyles,
    gallerySize: styles.modifiedGallerySize ? styles.gallerySize : Math.round(styles.gallerySize * 9 + 100),
    modifiedGallerySize: true
  }
}

export default class EmptyGallery extends React.Component {
  
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

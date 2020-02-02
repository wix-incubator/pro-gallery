
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.EMPTY,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    gallerySize: Math.round(styles.gallerySize * 9 + 100)
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

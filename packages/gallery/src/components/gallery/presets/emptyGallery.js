
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const layoutStyles = {
  galleryLayout: LAYOUTS.EMPTY,
}
export default class EmptyGallery extends React.Component {
  
  createStyles = () => {
    return {
      ...this.props.styles,
      ...layoutStyles,
      gallerySize: Math.round(this.props.styles.gallerySize * 9 + 100)
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

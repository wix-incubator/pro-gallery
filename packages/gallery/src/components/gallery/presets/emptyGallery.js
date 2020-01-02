
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.EMPTY,
}
export default class ColumnGallery extends React.Component {

  render() {
    return (
      <ProGallery
        {...this.props}
        styles={{
          ...this.props.styles,
          ...fixedStyles,
          gallerySize: Math.round(this.props.styles.gallerySize * 9 + 100)
        }}
      />
    );
  }
}

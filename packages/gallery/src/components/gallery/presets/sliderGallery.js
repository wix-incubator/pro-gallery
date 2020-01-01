
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.SLIDER,
  enableInfiniteScroll: true,
  cubeImages: true
}
export default class SliderGallery extends React.Component {
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

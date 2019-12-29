
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.THUMBNAIL,
}
export default class ThumbnailGallery extends React.Component {
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

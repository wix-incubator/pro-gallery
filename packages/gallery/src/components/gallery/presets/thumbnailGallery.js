
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class ThumbnailGallery extends React.Component {

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.THUMBNAIL,
            imageMargin: 0
        }

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

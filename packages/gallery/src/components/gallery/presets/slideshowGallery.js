import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class SlideshowGallery extends React.Component {

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.SLIDESHOW,
            enableInfiniteScroll: true,
            allowHover: false
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

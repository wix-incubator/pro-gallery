
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class FullsizeGallery extends React.Component {

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.FULLSIZE,
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

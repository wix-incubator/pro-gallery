
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class alternateGallery extends React.Component {

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.ALTERNATE,
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

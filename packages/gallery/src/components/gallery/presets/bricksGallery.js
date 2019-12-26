
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class BricksGallery extends React.Component {

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.BRICKS,
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

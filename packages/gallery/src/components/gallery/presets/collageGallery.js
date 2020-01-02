
import React from 'react';
import PropTypes from 'prop-types';

import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import basePropTypes from '../proGallery/propTypes';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLLAGE,
}
export default class CollageGallery extends React.Component {

    static propTypes = {
        ...basePropTypes,

        isVertical: PropTypes.bool,
        isRTL: PropTypes.bool,
        imageMargin: PropTypes.number
    }

    render() {
        const {isVertical, isRTL, imageMargin, styles, ...otherProps} = this.props;

        return (
            <ProGallery
                {...otherProps}
                styles={{
                    ...styles,
                    ...fixedStyles,
                    isVertical, isRTL, imageMargin,
                }}
            />
        );
    }
}

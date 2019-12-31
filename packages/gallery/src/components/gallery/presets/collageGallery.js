
import React from 'react';
import PropTypes from 'prop-types';

import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import {basePropTypes} from '../index';

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

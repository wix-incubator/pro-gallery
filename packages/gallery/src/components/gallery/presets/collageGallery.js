
import React from 'react';
import PropTypes from 'prop-types';

import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import {basePropTypes} from '../index';

export default class CollageGallery extends React.Component {

    static propTypes = {
        ...basePropTypes,

        isVertical: PropTypes.bool,
        isRTL: PropTypes.bool,
        imageMargin: PropTypes.number
    }

    render() {

        const fixedStyles = {
            galleryLayout: LAYOUTS.COLLAGE,
            showArrows: false,
            cubeImages: false,
            groupSize: 3,
            groupTypes: '1,2h,2v,3t,3b,3l,3r',
            fixedColumns: 0,
            hasThumbnails: false,
            enableScroll: true,
            cropOnlyFill: false,
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

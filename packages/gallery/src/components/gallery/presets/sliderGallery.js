import React from 'react';
import PropTypes from 'prop-types';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';

export default class SliderGallery extends React.Component {

    static propTypes = {
        items: PropTypes.array,
        container: PropTypes.object,
        eventListener: PropTypes.function,

        rtl: PropTypes.bool, //isRTL
        loop: PropTypes.bool, //slideshowLoop
        autoSlide: PropTypes.number, //isAutoSlideshow && autoSlideshowInterval
        cropRatio: PropTypes.number, //cubeImages && (gallerySliderImageRatio && cubeRatio)
    }

    render() {

        const {rtl, loop, autoSlide, cropRatio} = this.props;

        const options = {
            isRTL: !!rtl,
            slideshowLoop: !!loop,
            isAutoSlideshow: (autoSlide > 0),
            autoSlideshowInterval: Number(autoSlide),
            cubeImages: !!cropRatio,
            gallerySliderImageRatio: Number(cropRatio),
            cubeRatio: Number(cropRatio),

        }

        return (
            <ProGallery
                {...this.props}
                styles={{
                    galleryLayout: LAYOUTS.SLIDER,
                    ...this.props.styles,
                    ...this.props.options,
                    ...options
                }}
            />
        );
    }
}

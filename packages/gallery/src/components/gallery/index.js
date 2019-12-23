import React from 'react';
import LeanGallery from './leanGallery/leanGallery';
import ProGallery from './proGallery/proGallery';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import SlideshowGallery from './presets/slideshowGallery';
import GridGallery from './presets/gridGallery';
import LAYOUTS from '../../common/constants/layout';

export default props => {

    const styleParams = {...props.options, ...props.styles, ...props.styleParams};
    const {styles, ...otherProps} = props;

    let GalleryComponent = ProGallery;
    if (isEligibleForLeanGallery(props)) {
        GalleryComponent = LeanGallery;
    } else {
        switch (styleParams.galleryLayout) {
            case LAYOUTS.SLIDESHOW:
                GalleryComponent = SlideshowGallery;
                break;
            case LAYOUTS.GRID:
                GalleryComponent = GridGallery;
                break;
            }
    }
    return <GalleryComponent {...otherProps} styles={styleParams}/>
}

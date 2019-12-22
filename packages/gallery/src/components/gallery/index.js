import React from 'react';
import LeanGallery from './leanGallery/leanGallery';
import ProGallery from './proGallery/proGallery';
import isEligibleForLeanGallery from './leanGallery/isEligible';

export default props => {
    const Gallery = isEligibleForLeanGallery(props) ? LeanGallery : ProGallery;
    return <Gallery {...props} />
}

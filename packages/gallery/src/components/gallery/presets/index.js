import PropTypes from 'prop-types';

import CollageGallery from './collageGallery';
import MasonryGallery from './masonryGallery';
import GridGallery from './gridGallery';
import ThumbnailGallery from './thumbnailGallery';
import SliderGallery from './sliderGallery';
import SlideshowGallery from './slideshowGallery';
import PanoramaGallery from './panoramaGallery';
import ColumnGallery from './columnGallery';
import MagicGallery from './magicGallery';
import FullsizeGallery from './fullsizeGallery';
import BricksGallery from './bricksGallery';
import MixGallery from './mixGallery';
import AlternateGallery from './alternateGallery';

export const basePropTypes = {
    items: PropTypes.array.isRequired,
    container: PropTypes.object.isRequired,

    domId: PropTypes.string,
    scrollingElement: PropTypes.any,
    options: PropTypes.object,
    eventsListener: PropTypes.function,
    totalItemsCount: PropTypes.number,
    resizeMediaUrl: PropTypes.function,
};

export const PRESETS = {
    CollageGallery,
    MasonryGallery,
    GridGallery,
    ThumbnailGallery,
    SliderGallery,
    SlideshowGallery,
    PanoramaGallery,
    ColumnGallery,
    MagicGallery,
    FullsizeGallery,
    BricksGallery,
    MixGallery,
    AlternateGallery,
}

import { expect } from 'chai';
import _ from 'lodash';
import defaultStyles from '../src/common/defaultStyles';

describe('defaultStyles', () => {
  it('should return the expected styles unchanged', () => {
    const actual = defaultStyles;
    expect(_.isEqual(actual, expectedStyles())).eq(true);
    const actualLength = _.keys(actual).length;
    expect(actualLength).eq(_.keys(expectedStyles()).length);
    expect(actualLength).eq(97);
  });
});

function expectedStyles() {
  return {
    layoutParams: { gallerySpacing: 0 },

    isRTL: false,
    isVertical: false,
    gallerySize: 30,
    minItemSize: 120,
    chooseBestGroup: true,
    groupSize: 3,
    groupTypes: '1,2h,2v,3t,3b,3l,3r',
    rotatingGroupTypes: '',
    collageDensity: 0.8,
    cubeImages: false,
    cubeType: 'fill',
    cropRatio: 1,
    cropOnlyFill: false,
    smartCrop: false,
    rotatingCropRatios: '',
    columnWidths: '',
    fixedColumns: 0,
    numberOfImagesPerRow: 3,
    numberOfImagesPerCol: 1,
    groupsPerStrip: 0,
    imageMargin: 10,
    scatter: 0,
    rotatingScatter: '',
    gridStyle: 0,
    placeGroupsLtr: false,
    oneRow: false,
    showArrows: true,
    enableInfiniteScroll: true,
    thumbnailSpacings: 4,
    galleryThumbnailsAlignment: 'bottom',
    enableScroll: true,
    hasThumbnails: false,
    isGrid: false,
    isSlider: false,
    isColumns: false,
    isMasonry: false,
    isSlideshow: false,
    isAutoSlideshow: false,
    slideshowLoop: false,
    autoSlideshowInterval: 4,
    titlePlacement: 'SHOW_ON_HOVER',
    galleryTextAlign: 'center',
    scrollSnap: false,
    itemClick: 'nothing',
    fullscreen: true,
    videoPlay: 'hover',
    scrollAnimation: 'NO_EFFECT',
    slideAnimation: 'SCROLL',
    scrollDirection: 0,
    scrollDuration: 400,
    overlayAnimation: 'NO_EFFECT',
    arrowsPosition: 0,
    arrowsVerticalPosition: 'ITEM_CENTER',
    arrowsSize: 23,
    arrowsPadding: 23,
    loadMoreAmount: 'all',
    slideshowInfoSize: 200,
    playButtonForAutoSlideShow: false,
    pauseAutoSlideshowOnHover: true,
    allowSlideshowCounter: false,
    hoveringBehaviour: 'APPEARS',
    thumbnailSize: 120,
    magicLayoutSeed: 1,
    imageHoverAnimation: 'NO_EFFECT',
    imagePlacementAnimation: 'NO_EFFECT',
    calculateTextBoxWidthMode: 'PERCENT',
    textBoxHeight: 200,
    textBoxWidth: 200,
    textBoxWidthPercent: 50,
    textImageSpace: 10,
    textBoxBorderRadius: 0,
    textBoxBorderWidth: 0,
    loadMoreButtonText: '',
    imageInfoType: 'NO_BACKGROUND',
    itemBorderWidth: 0,
    itemBorderRadius: 0,
    itemEnableShadow: false,
    itemShadowBlur: 20,
    itemShadowDirection: 135,
    itemShadowSize: 10,
    imageLoadingMode: 'BLUR',
    videoSound: false,
    videoSpeed: '1',
    videoLoop: true,
    jsonStyleParams: '',
    showVideoControls: false,
    shouldIndexDirectShareLinkInSEO: true,
    slideTransition: 'cubic-bezier(0.46,0.1,0.25,1)',
    useMaxDimensions: false,
    enableVideoPlaceholder: true,
    autoSlideshowType: 'interval',
    autoSlideshowContinuousSpeed: 200,
    overlayPosition: 'LEFT',
    overlaySize: 100,
    overlaySizeType: 'PERCENT',
    overlayPadding: 0,
  };
}

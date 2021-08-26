import { expect } from 'chai';
import _ from 'lodash';
import defaultOptions from '../src/common/defaultOptions';
import { flattenObject } from '../src/core/helpers/optionsUtils';
import GALLERY_CONSTS from '../src/common/constants';

describe('defaultOptions', () => {
  it('should return the expected options unchanged', () => {
    const actual = flattenObject(defaultOptions);
    const expected = flattenObject(expectedOptions());
    expect(_.isEqual(actual, expected)).eq(true);
    const actualLength = _.keys(actual).length;
    expect(actualLength).eq(_.keys(expected).length);
    expect(actualLength).eq(98);
  });
});

function expectedOptions() {
  return {
    layoutParams: {
      gallerySpacing: 0,
      cropRatio: 1,
      repeatingGroupTypes: '',
    },
    behaviourParams: {
      item: {
        video: {
          playTrigger: GALLERY_CONSTS.videoPlay.HOVER,
        },
      },
    },
    isRTL: false,
    isVertical: false,
    gallerySize: 30,
    minItemSize: 120,
    chooseBestGroup: true,
    groupSize: 3,
    groupTypes: '1,2h,2v,3t,3b,3l,3r',
    collageDensity: 0.8,
    cubeImages: false,
    cubeType: 'fill',
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
    cubeFitPosition: GALLERY_CONSTS.cubeFitPosition.MIDDLE,
    enableVideoPlaceholder: true,
    autoSlideshowType: 'interval',
    autoSlideshowContinuousSpeed: 200,
    overlayPosition: 'LEFT',
    overlaySize: 100,
    overlaySizeType: 'PERCENT',
    overlayPadding: 0,
  };
}

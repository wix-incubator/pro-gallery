import { expect } from 'chai';
import defaultOptions, {
  populateWithDefaultOptions,
} from '../src/common/defaultOptions';
import { flattenObject } from '../src/core/helpers/optionsUtils';
import { extendNestedOptionsToIncludeOldAndNew } from '../src/core/helpers/optionsConverter';
import GALLERY_CONSTS from '../src/common/constants';

describe('defaultOptions', () => {
  it('should return the expected options unchanged', () => {
    const actual = flattenObject(defaultOptions);
    const expected = flattenObject(expectedOptions());
    expect(actual).to.eql(expected);
  });
  it('should populate missing properties with default properties and should leave defined properties as they are', () => {
    const actual = flattenObject(defaultOptions);
    const expected = flattenObject(expectedOptions());
    expect(actual).to.eql(expected);
    let customOptions = { layoutParams: { structure: { galleryLayout: 5 } } };
    const migrated = extendNestedOptionsToIncludeOldAndNew(customOptions);
    const flat = flattenObject(migrated);
    Object.keys(flat).forEach((key) =>
      flat[key] === undefined ? delete flat[key] : {}
    );
    expect(Object.keys(flat).length).to.eql(2); //this object should contains only 2 defined options (the old and new galleryLayout)
    let populated = populateWithDefaultOptions(migrated);
    expect(populated.galleryLayout).to.eql(5); //this should be 5 and not the default (-1)
    expect(populated.slideshowInfoSize).to.eql(200);
    expect(populated.gallerySize).to.eql(30);
    expect(populated.gallerySizeRatio).to.eql(0);
    expect(populated.gallerySizePx).to.eql(0);
    expect(populated.gallerySizeType).to.eql('smart');
  });
});

function expectedOptions() {
  return {
    layoutParams: {
      gallerySpacing: 0,
      cropRatio: 1,
      repeatingGroupTypes: '',
      navigationArrows: {
        type: GALLERY_CONSTS.arrowsType.DEFAULT_ARROW,
        container: {
          type: GALLERY_CONSTS.arrowsContainerStyleType.SHADOW,
          backgroundColor: 'rgba(0,0,0,0)',
          borderRadius: 0,
        },
        mouseCursorContainerMaxWidth: 100,
      },
      thumbnails: {
        position: GALLERY_CONSTS.thumbnailsPosition.OUTSIDE_GALLERY,
      },
      structure: { galleryRatio: { value: 0, includeExternalInfo: false } },
    },
    behaviourParams: {
      item: {
        content: {
          magnificationValue: 2,
        },
        secondaryMedia: {
          trigger: GALLERY_CONSTS.secondaryMediaTrigger.OFF,
          behaviour: GALLERY_CONSTS.secondaryMediaBehaviour.APPEARS,
        },
      },
    },
    scrollSnap: false,
    isRTL: false,
    isVertical: false,
    minItemSize: 120,
    groupSize: 3,
    chooseBestGroup: true,
    groupTypes: '1,2h,2v,3t,3b,3l,3r',
    cubeImages: false,
    cubeType: 'fill',
    smartCrop: false,
    fullscreen: true,
    videoLoop: true,
    videoSound: false,
    videoPlay: 'hover',
    videoSpeed: '1',
    numberOfImagesPerRow: 3,
    collageDensity: 0.8,
    galleryLayout: -1,
    galleryTextAlign: 'center',
    imageMargin: 10,
    fixedColumns: 0,
    showArrows: true,
    hasThumbnails: false,
    galleryThumbnailsAlignment: 'bottom',
    gridStyle: 0,
    titlePlacement: 'SHOW_ON_HOVER',
    hoveringBehaviour: 'APPEARS',
    isAutoSlideshow: false,
    slideshowLoop: false,
    playButtonForAutoSlideShow: false,
    pauseAutoSlideshowOnHover: true,
    allowSlideshowCounter: false,
    autoSlideshowInterval: 4,
    arrowsSize: 23,
    slideshowInfoSize: 200,
    imageLoadingMode: 'BLUR',
    scrollAnimation: 'NO_EFFECT',
    overlayAnimation: 'NO_EFFECT',
    imageHoverAnimation: 'NO_EFFECT',
    itemBorderWidth: 0,
    itemBorderRadius: 0,
    itemEnableShadow: false,
    itemShadowBlur: 20,
    loadMoreAmount: 'all',
    itemShadowDirection: 135,
    itemShadowSize: 10,
    imageInfoType: 'NO_BACKGROUND',
    textBoxBorderRadius: 0,
    textBoxBorderWidth: 0,
    textBoxHeight: 200,
    textImageSpace: 10,
    scrollDirection: 0,
    slideAnimation: 'SCROLL',
    autoSlideshowType: 'interval',
    autoSlideshowContinuousSpeed: 200,
    gallerySizePx: 0,
    gallerySizeRatio: 0,
    gallerySizeType: 'smart',
    itemShadowOpacityAndColor: '',
    arrowsColor: '',
    textBoxBorderColor: '',
    allowContextMenu: false,
    showVideoPlayButton: false,
    gallerySize: 30,
    cropOnlyFill: false,
    rotatingCropRatios: '',
    columnWidths: '',
    numberOfImagesPerCol: 1,
    groupsPerStrip: 0,
    scatter: 0,
    rotatingScatter: '',
    placeGroupsLtr: false,
    enableInfiniteScroll: true,
    thumbnailSpacings: 4,
    enableScroll: true,
    itemClick: 'nothing',
    scrollDuration: 400,
    arrowsPosition: 0,
    arrowsVerticalPosition: 'ITEM_CENTER',
    arrowsPadding: 23,
    thumbnailSize: 120,
    magicLayoutSeed: 1,
    imagePlacementAnimation: 'NO_EFFECT',
    calculateTextBoxWidthMode: 'PERCENT',
    textBoxWidth: 200,
    textBoxWidthPercent: 50,
    loadMoreButtonText: '',
    showVideoControls: false,
    shouldIndexDirectShareLinkInSEO: true,
    slideTransition: 'cubic-bezier(0.46,0.1,0.25,1)',
    useMaxDimensions: false,
    enableVideoPlaceholder: true,
    overlayPosition: 'LEFT',
    overlaySize: 100,
    overlaySizeType: 'PERCENT',
    overlayPadding: 0,
    cubeFitPosition: GALLERY_CONSTS.cubeFitPosition.MIDDLE,
    magnificationLevel: 2,
  };
}

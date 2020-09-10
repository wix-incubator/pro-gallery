import { dimensionsHelper, processLayouts, utils } from 'pro-gallery-lib';

const emptyLayout = {
  galleryType: undefined,
  groupSize: undefined,
  showArrows: undefined,
  cubeImages: undefined,
  cubeType: undefined,
  cubeRatio: undefined,
  isVertical: undefined,
  gallerySize: undefined,
  collageAmount: undefined,
  collageDensity: undefined,
  groupTypes: undefined,
  oneRow: undefined,
  imageMargin: undefined,
  galleryMargin: undefined,
  floatingImages: undefined,
  chooseBestGroup: undefined,
  smartCrop: undefined,
  hasThumbnails: undefined,
  enableScroll: undefined,
  isGrid: undefined,
  isSlider: undefined,
  isColumns: undefined,
  isSlideshow: undefined,
  cropOnlyFill: undefined,
  fixedColumns: undefined,
  enableInfiniteScroll: undefined,
};

function getStyleByGalleryType(styles) {
  //legacy layouts
  const { galleryType, gallerySize } = styles;

  const galleryTypes = {
    collage_ver: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      targetItemSize: Math.round(gallerySize * 5 + 500),
      fixedColumns: 0,
    }),
    collage_hor: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      targetItemSize: Math.round(gallerySize * 5 + 500),
      fixedColumns: 0,
    }),
    grid: () => ({
      cubeImages: true,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      targetItemSize: Math.round(gallerySize * 8.5 + 150),
      fixedColumns: 0,
      isGrid: true,
    }),
    masonry_ver: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      targetItemSize: Math.round(gallerySize * 8 + 200),
      fixedColumns: 0,
    }),
    masonry_hor: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      targetItemSize: Math.round(gallerySize * 5 + 200),
      fixedColumns: 0,
    }),
    one_col: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      targetItemSize: () => dimensionsHelper.getGalleryWidth(), //'full_width';
      fixedColumns: 1,
    }),
    one_row: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      targetItemSize: () => dimensionsHelper.getGalleryHeight(),
      fixedColumns: 0,
    }),
    slideshow: () => ({
      showArrows: true,
      cubeImages: true,
      cubeRatio: () => dimensionsHelper.getGalleryRatio(),
      isVertical: true,
      targetItemSize: () => dimensionsHelper.getGalleryWidth(),
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      fixedColumns: 1,
    }),
  };

  let styleState;

  switch (galleryType) {
    case '-1': //empty
      styleState = {};
      break;
    case '0': //vertical collage
      styleState = galleryTypes.collage_ver();
      break;
    default:
    case '1': //horizontal collage
      styleState = galleryTypes.collage_hor();
      break;
    case '2': //grid
      styleState = galleryTypes.grid();
      break;
    case '3': //vertical masonry
      styleState = galleryTypes.masonry_ver();
      break;
    case '4': //horizontal masonry
      styleState = galleryTypes.masonry_hor();
      break;
    case '5': //one column
      styleState = galleryTypes.one_col();
      break;
    case '6': //one row
      styleState = galleryTypes.one_row();
      break;
    case '7': //slideshow
      styleState = galleryTypes.slideshow();
      break;
  }

  return styleState;
}

function addLayoutStyles(styles, customExternalInfoRendererExists) {
  const galleryLayoutV1 = styles.galleryType;
  const galleryLayoutV2 = styles.galleryLayout;

  if (!utils.isUndefined(galleryLayoutV1) && utils.isUndefined(galleryLayoutV2)) {
    //legacy layouts - only if galleyrType parameter is specifically defined (i.e. layout had changed)

    styles = Object.assign(styles, getStyleByGalleryType(styles)); //legacy layouts
    styles.layoutsVersion = 1;
    const selectedLayoutVars = [
      'galleryType',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'cubeType',
      'isVertical',
      'scrollDirection',
      'enableInfiniteScroll',
    ];
    styles.selectedLayout = selectedLayoutVars
      .map(key => String(styles[key]))
      .join('|');
  } else {
    //new layouts
    if (utils.isVerbose()) {
      console.log('Using galleryLayout for defaults', styles);
    }

    styles = Object.assign({}, emptyLayout, styles);
    const selectedLayoutVars = [
      'galleryLayout',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'cubeType',
      'isVertical',
      'scrollDirection',
      'enableInfiniteScroll',
    ];
    styles.selectedLayout = selectedLayoutVars
      .map(key => String(styles[key]))
      .join('|');
    styles.layoutsVersion = 2;
    styles.selectedLayoutV2 = galleryLayoutV2;
    if (utils.isVerbose()) {
      console.log('new selected layout', styles.selectedLayout);
    }
  }
  styles = Object.assign(styles, processLayouts(styles, customExternalInfoRendererExists));
  return styles;
}

export default addLayoutStyles;

const PLACEMENTS = [
  {id: 'SHOW_ON_HOVER', value: 'On Hover'},
  {id: 'SHOW_BELOW', value: 'Below'},
  {id: 'SHOW_ABOVE', value: 'Above'},
  {id: 'DONT_SHOW', value: 'Dont show'},
];

const VALUES = {
  scrollDirection: {
    value: 0,
    binaryOptions: ['Vertical', 'Horizontal'],
    title: 'Scroll Direction',
  },
  isVertical: {
    value: 0,
    binaryOptions: ['Vertical', 'Horizontal'],
    title: 'Image Orientation',
  },
  allowTitle: {value: false, title: 'Show Title'},
  allowDescription: {value: false, title: 'Show Description'},
  gallerySize: {value: 30, title: 'Thumbnail Size', min: 0, max: 100},
  thumbnailSize: {value: 120, title: 'Thumbnail Size', min: 80, max: 300},
  imageMargin: {value: 10, title: 'Spacing', min: 0, max: 100},
  thumbnailSpacings: {value: 4, title: 'Spacing', min: 0, max: 20},
  collageDensity: {value: 80, title: 'Collage Density', min: 0, max: 100},
  titlePlacement: {
    value: 'DONT_SHOW',
    title: 'Title & Description Position',
    options: PLACEMENTS,
  },
  gridStyle: {
    value: 0,
    binaryOptions: ['Fit To Screen', 'Set Items Per Row'],
    title: 'Behaviour',
  },
  numberOfImagesPerRow: {value: 3, title: 'Images Per Row', min: 1, max: 5},
  numberOfImagesPerCol: {value: 2, title: 'Images Per Col', min: 1, max: 3},
  imageResize: {
    value: 0,
    binaryOptions: ['Crop', 'Fit'],
    title: 'Thumbnail Resize',
  },
  cubeRatio: {
    value: 2,
    title: 'Image Ratio',
    options: [
      {id: (16/9), value: '16:9'},
      {id: (4/3), value: '4:3'},
      {id: (1), value: '1:1'},
      {id: (3/4), value: '3:4'},
      {id: (9/16), value: '9:16'},
    ],
  },
  galleryThumbnailsAlignment: {
    value: 'bottom',
    title: 'Thumbnail Placement',
    options: [
      {id: 'bottom', value: 'Bottom'},
      {id: 'left', value: 'Left'},
      {id: 'top', value: 'Top'},
      {id: 'right', value: 'Right'},
    ],
  },
  slideshowLoop: {value: false, title: 'Loop Images'},
  isAutoSlideshow: {value: false, title: 'Auto Slide'},
  allowDownload: {value: false, title: 'Show Download Button'},
  loveButton: {value: false, title: 'Show Love Button'},
  loveCounter: {value: false, title: 'Show Love Counter'},
  allowSocial: {value: false, title: 'Show Share Button'},
};

function prepareProps(propList) {
  return propList.reduce((acc, key) => {
    acc[key] = VALUES[key];
    return acc;
  }, {});
}

const commonProps = [
  'allowTitle',
  'allowDescription',
  'imageMargin',
];

export const layoutProps = {
  collage: prepareProps([
    'scrollDirection',
    'isVertical',
    'gallerySize',
    'imageMargin',
    'collageDensity',
    ...commonProps
  ]),
  masonry: prepareProps([
    'isVertical',
    'titlePlacement',
    'gridStyle',
    'numberOfImagesPerRow',
    'gallerySize',
    'imageMargin',
    ...commonProps
  ]),
  grid: prepareProps([
    'scrollDirection',
    'titlePlacement',
    'imageResize',
    'cubeRatio',
    'gridStyle',
    'numberOfImagesPerRow',
    'numberOfImagesPerCol',
    'gallerySize',
    'imageMargin',
    ...commonProps
  ]),
  thumbnails: prepareProps([
    'slideshowLoop',
    'isAutoSlideshow',
    'imageResize',
    'galleryThumbnailsAlignment',
    'thumbnailSpacings',
    'thumbnailSize',
    ...commonProps
  ]),
  slider: prepareProps([
    'slideshowLoop',
    'isAutoSlideshow',
    'titlePlacement',
    'cubeRatio',
    ...commonProps
  ]),
};

export const generalProps = prepareProps([
  'allowDownload',
  'loveButton',
  'loveCounter',
  'allowSocial',
])
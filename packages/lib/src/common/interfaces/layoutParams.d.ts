export interface LayoutParams {
  collage: Collage;
  crop: Crop;
  structure: Structure;
  thumbnails: Thumbnails;
  navigationArrows: NavigationArrows;
  info: Info;
  targetItemSize: TargetItemSize;

  enableStreching: boolean;
  gallerySpacing: number;
  itemSpacing: number;
  scrollDirection: 'VERTICAL' | 'HORIZONTAL';

  isSlideshow: boolean; //I dont want this but how can I get rid of it?
  isGrid: boolean; //I dont want this but how can I get rid of it?
  isSlider: boolean; //I dont want this but how can I get rid of it?
  isColumns: boolean; //I dont want this but how can I get rid of it?
  [key: string]: any;
}

export interface Collage {
  // amount: number; //doesnt exist. eradicate.
  density: number;
  groupByOrientation: boolean;
  numberOfGroupsPerRow: number;

  allowedGroupTypes: Array<
    '1' | '2h' | '2v' | '3h' | '3v' | '3t' | '3b' | '3l' | '3r'
  >;
  repeatingGroupTypes: Array<
    '1' | '2h' | '2v' | '3h' | '3v' | '3t' | '3b' | '3l' | '3r'
  >;
  groupSize: number;
}
export interface Thumbnails {
  enable: boolean;
  spacing: number;
  size: number;
  alignment: 'BOTTOM' | 'RIGHT' | 'LEFT' | 'TOP';
}
export interface Scatter {
  randomScatter: number;
  manualScatter: string;
}
export interface NavigationArrows {
  enable: boolean;
  size: number;
  padding: number;
  position: 'ON_GALLERY' | 'OUTSIDE_GALLERY';
  verticalAlignment: 'ITEM_CENTER' | 'IMAGE_CENTER' | 'INFO_CENTER';
}

export interface Crop {
  method: 'FILL' | 'FIT' | 'MIN' | 'MAX';
  alignment: 'CENTER' | 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';
  enable: boolean;
  enableSmartCrop: boolean;
  cropOnlyFill: boolean; //DELETE? - its used in slider gallery
  ratios: Array<number>; //This is cropRatio and rotatingCropRatios all together.
}
export interface Structure {
  numberOfColumns: number; //numberOfImagesPerCol: number;
  numberOfRows: number; //numberOfImagesPerRow: number;
  responsiveMode: 'FIT_TO_SCREEN' | 'SET_ITEMS_PER_ROW';
  columnRatios: Array<number>;
  scatter: Scatter;
  layoutOrientation: 'VERTICAL' | 'HORIZONTAL'; //isVertical
  groupsOrder: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'BY_HEIGHT'; //use const? or is this the new const?
}

export interface TargetItemSize {
  unit: 'PERCENT' | 'PIXEL' | 'SMART';
  value: number;
  minimum: number; //moved here but its not in the same units... we should make it so in the gallery in a refactor and consider it a bug
}
export interface Info {
  sizeUnits: 'PERCENT' | 'PIXEL';
  width: number;
  height: number;
  spacing: number;
  layout:
    | 'NO_BACKGROUND'
    | 'ATTACHED_BACKGROUND'
    | 'SEPARATED_BACKGROUND'
    | 'DONT_SHOW';
  border: InfoBorder;
  placement:
    | 'OVERLAY'
    | 'ABOVE'
    | 'BELOW'
    | 'LEFT'
    | 'RIGHT'
    | 'ALTERNATE_HORIZONTALLY'
    | 'ALTERNATE_VERTICALLY';
  slideshowInfoSize: number;

  [key: string]: any;
}
export interface InfoBorder {
  width: number;
  color: string;
  radius: number;
  [key: string]: any;
}
// const layoutParamsMap = {
//   fixedColumns: 'layoutParams_fixedColumns', // layouter internal
//   externalInfoHeight: 'layoutParams_externalInfoHeight', //layouter API
//   externalInfoWidth: 'layoutParams_externalInfoWidth', //layouter API
//   targetItemSize: 'layoutParams_targetItemSize', //layouter API
// forceMobileCustomButton - I'll delete this
// };

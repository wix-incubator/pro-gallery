export interface LayoutParams {
  collage: Collage;
  thumbnails: Thumbnails;
  navigationArrows: NavigationArrows;
  info: Info;
  targetItemSize: TargetItemSize;

  gallerySpacing: number;
  itemSpacing: number;
  enableStreching: boolean;
  croppedAlignment: 'CENTER' | 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';
  cropRatios: Array<number>; //This is cropRatio and rotatingCropRatios all together.
  // numberOfGroupsPerRow: number;
  numberOfColumns: number; //numberOfImagesPerCol: number;
  numberOfRows: number; //numberOfImagesPerRow: number;
  columnRatios: Array<number>;
  cropMethod: string;

  enableCrop: boolean;
  enableSmartCrop: boolean;
  minItemSize: number;
  cropOnlyFill: boolean; //DELETE? - its used in slider gallery
  forceGroupsOrder: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'BY_COLUMNS'; //use const? or is this the new const?
  slideshowInfoSize: number;
  scatter: Scatter;
  scrollDirection: 'VERTICAL' | 'HORIZONTAL';
  layoutOrientation: 'VERTICAL' | 'HORIZONTAL'; //isVertical
  isSlideshow: boolean; //I dont want this but how can I get rid of it?
  isGrid: boolean; //I dont want this but how can I get rid of it?
  isMasonry: boolean; //I dont want this but how can I get rid of it?
  isSlider: boolean; //I dont want this but how can I get rid of it?
  isColumns: boolean; //I dont want this but how can I get rid of it?
  [key: string]: any;
}

export interface Collage {
  // amount: number; //doesnt exist. eradicate.
  density: number;
  groupByOrientation: boolean;
  groupTypes: Array<
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

export interface TargetItemSize {
  unit: 'PERCENT' | 'PIXEL' | 'SMART';
  value: number;
}
export interface Info {
  sizeCalculationMode: 'PERCENT' | 'PIXEL';
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

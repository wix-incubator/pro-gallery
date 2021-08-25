export interface LayoutParams {
  collage: Collage;
  thumbnails: Thumbnails;
  navigationArrows: NavigationArrows;
  info: Info;

  gallerySpacing: number;
  itemSpacing: number;
  enableStreching: boolean;

  cropRatios: number | string | Array<string>; //This is cropRatio and rotatingCropRatios all together.
  // numberOfGroupsPerRow: number;
  numberOfColumns: number; //numberOfImagesPerCol: number;
  numberOfRows: number; //numberOfImagesPerRow: number;
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
  // amount: number;
  density: number;
  groupByOrientation: boolean;
  groupTypes: string | Array<string>; // the string is of a closed list of strings. need to validate it. how? //the Array is the representation of rotating.
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
export interface Info {
  sizeCalculationMode: 'PERCENT' | 'MANUAL';
  width: number;
  height: number;
  spacing: number;
  backgroundMode:
    | 'NO_BACKGROUND'
    | 'ATTACHED_BACKGROUND'
    | 'SEPARATED_BACKGROUND';
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
// };

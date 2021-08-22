export interface LayoutParams {
  cropRatio: number | string | array<string>; //This is cropRatio and rotatingCropRatios all together.
  // numberOfGroupsPerRow: number;
  numberOfColumns: number; //numberOfImagesPerCol: number;
  numberOfRows: number; //numberOfImagesPerRow: number;
  gallerySpacing: number;
  cropType: string;
  enableCrop: boolean;
  enableStreching: boolean;
  enableSmartCrop: boolean;
  minItemSize: number;
  cropOnlyFill: boolean; //DELETE?
  itemSpacing: number;
  forceGroupsOrder: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT'; //use const? or is this the new const?
  slideshowInfoSize: number;
  collage: Collage;
  thumbnails: Thumbnails;
  navigationArrows: NavigationArrows;
  scatter: number; //make sure this is a number;
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
  amount: number;
  density: number;
  groupByOrientation: boolean;
  groupTypes: string | array<string>; // the string is of a closed list of strings. need to validate it. how? //the array is the representation of rotating.
  groupSize: number;
}
export interface Thumbnails {
  enable: boolean;
  spacings: number;
  size: number;
  alignment: 'bottom' | 'right' | 'left' | 'top';
}
export interface NavigationArrows {
  enable: boolean;
  size: number;
  padding: number;
  position: 'ON_THE_GALLERY' | 'OUTSIDE_THE_GALLERY';
  verticalAlignment: 'ITEM' | 'IMAGE' | 'INFO';
}
const layoutParamsMap = {
  fixedColumns: 'layoutParams_fixedColumns', // layouter internal
  externalInfoHeight: 'layoutParams_externalInfoHeight', //layouter API
  externalInfoWidth: 'layoutParams_externalInfoWidth', //layouter API
  targetItemSize: 'layoutParams_targetItemSize', //layouter API
};

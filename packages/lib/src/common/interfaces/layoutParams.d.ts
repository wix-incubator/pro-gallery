export interface LayoutParams {
  groups?: Groups;
  crop?: Crop;
  structure?: Structure;
  thumbnails?: Thumbnails;
  navigationArrows?: NavigationArrows;
  info?: Info;
  targetItemSize?: TargetItemSize;
}

export interface Groups {
  // amount?: number; //doesnt exist. eradicate.
  density?: number;
  groupByOrientation?: boolean;
  numberOfGroupsPerRow?: number;
  allowedGroupTypes?: Array<
    '1' | '2h' | '2v' | '3h' | '3v' | '3t' | '3b' | '3l' | '3r'
  >;
  repeatingGroupTypes?: Array<
    '1' | '2h' | '2v' | '3h' | '3v' | '3t' | '3b' | '3l' | '3r'
  >;
  groupSize?: number;
}

export interface Thumbnails {
  enable?: boolean;
  spacing?: number;
  size?: number;
  alignment?: 'BOTTOM' | 'RIGHT' | 'LEFT' | 'TOP';
}

export interface Scatter {
  randomScatter?: number;
  manualScatter?: string;
}

export interface NavigationArrows {
  enable?: boolean;
  size?: number;
  padding?: number;
  position?: 'ON_GALLERY' | 'OUTSIDE_GALLERY';
  verticalAlignment?: 'ITEM_CENTER' | 'IMAGE_CENTER' | 'INFO_CENTER';
  type: number;
}

export interface Crop {
  method?: 'FILL' | 'FIT' | 'MIN' | 'MAX';
  alignment?: 'CENTER' | 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';
  enable?: boolean;
  enableSmartCrop?: boolean;
  cropOnlyFill?: boolean; //DELETE? - its used in slider gallery
  ratios?: Array<number>; //This is cropRatio and rotatingCropRatios all together.
}

export interface Structure {
  galleryLayout?: number;
  enableStreching?: boolean;
  gallerySpacing?: number;
  itemSpacing?: number;
  scrollDirection?: 'VERTICAL' | 'HORIZONTAL';
  numberOfColumns?: number; //numberOfImagesPerCol: number;
  numberOfGridRows?: number; //numberOfImagesPerRow: number;
  responsiveMode?: 'FIT_TO_SCREEN' | 'SET_ITEMS_PER_ROW';
  columnRatios?: Array<number>;
  scatter?: Scatter;
  layoutOrientation?: 'VERTICAL' | 'HORIZONTAL'; //isVertical
  groupsOrder?: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'BY_HEIGHT'; //use const? or is this the new const?
}

export interface TargetItemSize {
  unit?: 'PERCENT' | 'PIXEL' | 'SMART';
  value?: number;
  minimum?: number; //moved here but its not in the same units... we should make it so in the gallery in a refactor and consider it a bug
}

export interface Info {
  sizeUnits?: 'PERCENT' | 'PIXEL';
  width?: number;
  height?: number;
  spacing?: number;
  layout?:
    | 'NO_BACKGROUND'
    | 'ATTACHED_BACKGROUND'
    | 'SEPARATED_BACKGROUND'
    | 'DONT_SHOW';
  border?: InfoBorder;
  placement?:
    | 'OVERLAY'
    | 'ABOVE'
    | 'BELOW'
    | 'LEFT'
    | 'RIGHT'
    | 'ALTERNATE_HORIZONTALLY'
    | 'ALTERNATE_VERTICALLY';
}

export interface InfoBorder {
  width?: number;
  color?: string;
  radius?: number;
}

// const layoutParamsMap = {
//   fixedColumns: 'layoutParams_fixedColumns', // layouter internal
//   externalInfoHeight: 'layoutParams_externalInfoHeight', //layouter API
//   externalInfoWidth: 'layoutParams_externalInfoWidth', //layouter API
//   targetItemSize: 'layoutParams_targetItemSize', //layouter API
// forceMobileCustomButton - I'll delete this
// };

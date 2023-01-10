export interface BehaviourParams {
  item?: Item;
  gallery?: Gallery;
}

export interface Item {
  clickAction?: 'NOTHING' | 'LINK' | 'ACTION' | 'MAGNIFY';
  video?: Video;
  threeDimensionalScene?: ThreeDimensionalScene;
  overlay?: Overlay;
  content?: Content;
  secondaryMedia?: SecondaryMedia;
}

export interface Gallery {
  layoutDirection?: 'RIGHT_TO_LEFT' | 'LEFT_TO_RIGHT';
  blockContextMenu?: boolean;
  scrollAnimation?:
    | 'NO_EFFECT'
    | 'FADE_IN'
    | 'GRAYSCALE'
    | 'SLIDE_UP'
    | 'EXPAND'
    | 'SHRINK'
    | 'ZOOM_OUT'
    | 'ONE_COLOR'
    | 'MAIN_COLOR'
    | 'BLUR';
  enableIndexingShareLinks?: boolean;
  vertical?: Vertical;
  horizontal?: Horizontal;
}
export interface SecondaryMedia {
  trigger: 'OFF' | 'HOVER';
  behaviour: 'APPEARS';
}

export type PlayTrigger = 'CLICK' | 'HOVER' | 'AUTO';
export interface Video {
  speed?: number;
  volume?: number;
  loop?: boolean;
  playTrigger?: PlayTrigger;
  enablePlayButton?: boolean;
  enableControls?: boolean;
  enablePlaceholder?: boolean;
}

export interface ThreeDimensionalScene {
  transform?: Transform;
  controls?: Controls;
  playTrigger?: PlayTrigger;
}

export type Dimensions = `x${number}y${number}z${number}`;

export interface Transform {
  rotation?: Dimensions;
  scale?: Dimensions;
  position?: Dimensions;
}
export interface Controls {
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  enableAutoRotate?: boolean;
}

export interface Overlay {
  hoveringBehaviour?: 'APPEARS' | 'DISAPPEARS' | 'ALWAYS_SHOW' | 'NEVER_SHOW';
  hoverAnimation?:
    | 'NO_EFFECT'
    | 'FADE_IN'
    | 'EXPAND'
    | 'SLIDE_UP'
    | 'SLIDE_RIGHT'
    | 'SLIDE_DOWN'
    | 'SLIDE_LEFT';
  position?:
    | 'LEFT'
    | 'TOP'
    | 'RIGHT'
    | 'BUTTOM'
    | 'CENTERED_VERTICALLY'
    | 'CENTERED_HORIZONTALLY';
  size?: number;
  sizeUnits?: 'PIXEL' | 'PERCENT';
  padding?: number;
  backgroundColor?: any;
}

export interface Content {
  hoverAnimation?:
    | 'NO_EFFECT'
    | 'ZOOM_IN'
    | 'BLUR'
    | 'GRAYSCALE'
    | 'SHRINK'
    | 'INVERT'
    | 'COLOR_IN'
    | 'DARKENED';
  placementAnimation?: 'NO_EFFECT' | 'SLIDE';
  loader?: 'BLUR' | 'COLOR' | 'MAIN_COLOR';
  magnificationValue?: number;
}

export interface Vertical {
  loadMore?: LoadMore;
}

export interface Horizontal {
  enableScrollSnap?: boolean;
  slideAnimation?: 'SCROLL' | 'DECK' | 'FADE';
  slideTransition?: string;
  blockScroll?: boolean;
  navigationDuration?: number;
  loop?: boolean;
  autoSlide?: AutoSlide;
  slideshowInfo?: SlideshowInfo;
}

export interface AutoSlide {
  behaviour?: 'OFF' | 'CONTINUOUS' | 'INTERVAL'; //this unites the "enable" and  "type"
  interval?: number;
  pauseOnHover?: boolean;
  speed?: number;
}

export interface SlideshowInfo {
  buttonsAlignment?: 'LEFT' | 'RIGHT' | 'CENTER';
  enableCounter?: boolean;
  enablePlayButton?: boolean;
}

export interface LoadMore {
  enable?: boolean;
  amount?: 'PARTIAL' | 'ALL';
  text?: string;
}

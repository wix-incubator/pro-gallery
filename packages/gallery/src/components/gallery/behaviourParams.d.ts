export type PlayOn = 'hover' | 'auto' | 'onClick';
export interface Video {
  speed: number;
  volume: number;
  loop: boolean;
  playTrigger: 'CLICK' | 'HOVER' | 'AUTO'; //or playOn
  enablePlayButton: boolean;
  enableControls: boolean;
  [key: string]: any;
}
export interface Overlay {
  hoveringBehaviour: 'APPEARS' | 'DISAPPEARS' | 'ALWAYS_SHOW' | 'NEVER_SHOW';
  hoverAnimation:
    | 'NO_EFFECT'
    | 'ZOOM_IN'
    | 'BLUR'
    | 'GRAYSCALE'
    | 'SHRINK'
    | 'INVERT'
    | 'COLOR_IN'
    | 'DARKENED';
  position:
    | 'LEFT'
    | 'TOP'
    | 'RIGHT'
    | 'BUTTOM'
    | 'CENTERED_VERTICALLY'
    | 'CENTERED_HORIZONTALLY';
  size: number;
  sizeUnits: 'PIXEL' | 'PERCENT';
  padding: number;
  [key: string]: any;
}
export interface Content {
  hoverAnimation:
    | 'NO_EFFECT'
    | 'ZOOM_IN'
    | 'BLUR'
    | 'GRAYSCALE'
    | 'SHRINK'
    | 'INVERT'
    | 'COLOR_IN'
    | 'DARKENED';
  placementAnimation: 'NO_EFFECT' | 'SLIDE';
  loader: 'BLUR' | 'COLOR' | 'MAIN_COLOR';
  [key: string]: any;
}
export interface Info {
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
export interface Vertical {
  loadMore: LoadMore;
  [key: string]: any;
}
export interface Horizontal {
  enableScrollSnap: boolean;
  slideAnimation: 'SCROLL' | 'DECK' | 'FADE';
  blockScroll: boolean;
  navigationDuration: number;
  loop: boolean;
  autoSlide: AutoSlide;
  slideshowInfo: SlideshowInfo;
  [key: string]: any;
}
export interface AutoSlide {
  behaviour: 'OFF' | 'CONTINUOUS' | 'INTERVAL'; //this unites the "enable" and  "type"
  interval: number;
  pauseOnHover: boolean;
  speed: number;
  [key: string]: any;
}
export interface SlideshowInfo {
  buttonsAlignment: 'LEFT' | 'RIGHT' | 'CENTER';
  enableCounter: boolean;
  enablePlayButton: boolean;
  [key: string]: any;
}
export interface LoadMore {
  enable: boolean;
  amount: 'PARTIAL' | 'ALL';
  text: string;
  [key: string]: any;
}
export interface BehaviourParams {
  item?: Item;
  gallery?: Gallery;
  [key: string]: any;
}
export interface Item {
  clickAction: 'NOTHING' | 'LINK' | 'ACTION' | 'MAGNIFY';
  video: Video;
  overlay: Overlay;
  info: Info;
  content: Content;
  [key: string]: any;
}
export interface Gallery {
  layoutDirection: 'RIGHT_TO_LEFT' | 'LEFT_TO_RIGHT';
  disableContextMenu: boolean;
  scrollAnimation:
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
  vertical: Vertical;
  horizontal: Horizontal;
  // allowLeanGallery: 'behaviourParams_gallery_enableLeanGallery', //think about removing this!
  [key: string]: any;
}

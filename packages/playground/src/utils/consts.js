const placements = {
  SHOW_ON_HOVER: 'SHOW_ON_HOVER',
  SHOW_BELOW: 'SHOW_BELOW',
  SHOW_ABOVE: 'SHOW_ABOVE',
  SHOW_NOT_ON_HOVER: 'SHOW_NOT_ON_HOVER',
  SHOW_ALWAYS: 'SHOW_ALWAYS',
  DONT_SHOW: 'DONT_SHOW'
};

const infoBehaviourOnHover = {
    APPEARS: 'APPEARS',
    DISAPPEARS: 'DISAPPEARS',
    NO_CHANGE: 'NO_CHANGE',
  };

const scrollAnimations = {
  NO_EFFECT: 'NO_EFFECT',
  FADE_IN: 'FADE_IN',
  GRAYSCALE: 'GRAYSCALE',
  SLIDE_UP: 'SLIDE_UP',
  EXPAND: 'EXPAND',
  SHRINK: 'SHRINK',
  ZOOM_OUT: 'ZOOM_OUT',
  ONE_COLOR: 'ONE_COLOR'
};

const infoType = {
  NO_BACKGROUND: 'NO_BACKGROUND',
  ATTACHED_BACKGROUND: 'ATTACHED_BACKGROUND',
  SEPARATED_BACKGROUND: 'SEPARATED_BACKGROUND',
  DONT_SHOW: 'DONT_SHOW'
};

const loadingMode = {
  BLUR: 'BLUR',
  COLOR: 'COLOR',
};

const layout = {
  EMPTY: -1,
  COLLAGE: 0,
  MASONRY: 1,
  GRID: 2,
  THUMBNAIL: 3,
  SLIDER: 4,
  SLIDESHOW: 5,
  PANORAMA: 6,
  COLUMN: 7,
  MAGIC: 8,
  FULLSIZE: 9, 
  BRICKS: 10, 
  MIX: 11,
  ALTERNATE: 12 // Check that the pics shows 
};

const itemClick = {
  EXPAND: 'expand',
  LINK: 'link',
  NOTHING: 'nothing',
  FULLSCREEN: 'fullscreen',
};

const calculationOptions = {
  AUTOMATIC: 'AUTOMATIC',
  MANUAL: 'MANUAL',
};

const scrollDirection = {
  vertical: 0,
  horizontal: 1
};

const imageResize = {
  crop: 0,
  fit: 1
};

const thumbnailsAlignment = {
  bottom: 'bottom',
  left: 'left',
  top: 'top',
  right: 'right',
};

const watermarkDock = { // Not sure this will work
  LEFT_TOP: {
    top: 0,
    left: 0,
    transform: 'translate3d(0,0,0)'
  },
  MIDDLE_TOP: {
    top: 0,
    left: '50%',
    transform: 'translate3d(-50%,0,0)'
  },
  RIGHT_TOP: {
    top: 0,
    left: 'auto',
    right: 0,
    transform: 'translate3d(0,0,0)'
  },
  LEFT_MIDDLE: {
    top: '50%',
    left: 0,
    transform: 'translate3d(0,-50%,0)',
    margin: 0
  },
  MIDDLE: {
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    margin: 0
  },
  RIGHT_MIDDLE: {
    top: '50%',
    left: 'auto',
    right: 0,
    transform: 'translate3d(0,-50%,0)',
    margin: 0
  },
  LEFT_DOWN: {
    top: 'auto',
    bottom: 0,
    left: 0,
    transform: 'translate3d(0,0,0)'
  },
  MIDDLE_DOWN: {
    top: 'auto',
    left: '50%',
    bottom: 0,
    transform: 'translate3d(-50%,0,0)'
  },
  RIGHT_DOWN: {
    top: 'auto',
    left: 'auto',
    right: 0,
    bottom: 0,
    transform: 'translate3d(0,0,0)'
  }
}

const loadMoreAmount = {
  PARTIAL: 'partial',
  ALL: 'all',
};

const expandAnimations = {
  NO_EFFECT: 'NO_EFFECT',
  EXPAND: 'EXPAND',
  FADE_IN: 'FADE_IN',
  ZOOM: 'ZOOM'
};

const overlayAnimations = {
  NO_EFFECT: 'NO_EFFECT',
  FADE_IN: 'FADE_IN',
  EXPAND: 'EXPAND',
  SLIDE_UP: 'SLIDE_UP',
  SLIDE_RIGHT: 'SLIDE_RIGHT'
};

const imageHoverAnimations = {
  NO_EFFECT: 'NO_EFFECT',
  ZOOM_IN: 'ZOOM_IN',
  BLUR: 'BLUR',
  GRAYSCALE: 'GRAYSCALE',
  SHRINK: 'SHRINK',
  INVERT: 'INVERT',
  COLOR_IN: 'COLOR_IN',
  DARKENED: 'DARKENED'
};

const horizontalAlign = {
  LEFT: 'flex-start',
  CENTER: 'center',
  RIGHT: 'flex-end',
};

const verticalAlign = {
  TOP: 'flex-start',
  CENTER: 'center',
  BOTTOM: 'flex-end',
};

const videoPlay = {
  HOVER: 'hover',
  AUTO: 'auto',
  ON_CLICK: 'onClick',
}

export default {
    placements,
    infoBehaviourOnHover,
    scrollAnimations,
    infoType,
    loadingMode,
    layout,
    itemClick,
    calculationOptions,
    scrollDirection,
    imageResize,
    thumbnailsAlignment,
    watermarkDock,
    loadMoreAmount,
    expandAnimations,
    overlayAnimations,
    imageHoverAnimations,
    horizontalAlign,
    verticalAlign,
    videoPlay
  };
  
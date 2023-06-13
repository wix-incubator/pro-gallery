// import scrollAnimations from '../../common/constants/behaviourParams_gallery_scrollAnimation';
// type AvailableAnimations = keyof scrollAnimations;

// See Liron's animations here:
// https://docs.google.com/document/d/1dMqp0_gL0cjye2eiMYYaO1rOHRP04FRxEE3gOKQ5zvU
type AnimationSpec = {
  type:
    | 'FADE'
    | 'GRAYSCALE'
    | 'SHADOW'
    | 'SIZE'
    | 'ZOOM'
    | 'BLUR'
    | 'ROUND'
    | 'ONE_COLOR'
    | 'MAIN_COLOR'
    | 'ROTATE'
    | 'SPIRAL'
    | 'SQUEEZE'
    | 'FLIP'
    | 'SLIDE'
    | 'APPEAR'
    | 'PAN'
    | 'SKEW';
  fromValue: number;
  toValue: number;
  fromAnchor: 'ENTRY' | 'EXIT';
  toAnchor: 'ENTRY' | 'EXIT';
  fromPosition: number;
  toPosition: number;
  iterations: number;
  transitionDuration: number;
  randomOffset?: number;
  hinge?: 'center' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
  direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'IN' | 'OUT' | 'RIGHTWAY' | 'LEFTWAY';
  ease:
    | 'easeInSine'
    | 'easeOutSine'
    | 'easeInOutSine'
    | 'easeInQuad'
    | 'easeOutQuad'
    | 'easeInOutQuad'
    | 'easeInCubic'
    | 'easeOutCubic'
    | 'easeInOutCubic'
    | 'easeInQuart'
    | 'easeOutQuart'
    | 'easeInOutQuart'
    | 'easeInQuint'
    | 'easeOutQuint'
    | 'easeInOutQuint'
    | 'easeInExpo'
    | 'easeOutExpo'
    | 'easeInOutExpo'
    | 'easeInCirc'
    | 'easeOutCirc'
    | 'easeInOutCirc'
    | 'easeInBack'
    | 'easeOutBack'
    | 'easeInOutBack'
    | 'easeInElastic'
    | 'easeOutElastic'
    | 'easeInOutElastic'
    | 'easeInBounce'
    | 'easeOutBounce'
    | 'easeInOutBounce';
};

interface AdvancedAnimations {
  [key: string]: AnimationSpec[];
}

const advancedAnimations: AdvancedAnimations = {
  FADE: [
    {
      type: 'FADE',
      fromValue: 0,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 100,
      iterations: 10,
      transitionDuration: 2000,
      ease: 'easeOutCubic',
    },
  ],
  GRAYSCALE: [
    {
      type: 'GRAYSCALE',
      fromValue: 100,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 1000,
      ease: 'easeInSine',
    },
  ],
  SLIDE_UP: [
    {
      type: 'SLIDE',
      fromValue: 250,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      ease: 'easeOutCubic',
      transitionDuration: 1000,
      direction: 'IN',
    },
  ],
  EXPAND: [
    {
      type: 'SIZE',
      fromValue: 0.94,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 800,
      ease: 'easeOutQuad',
    },
  ],
  SHRINK: [
    {
      type: 'SIZE',
      fromValue: 1.05,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 800,
      ease: 'easeOutQuad',
    },
  ],
  ZOOM_OUT: [
    {
      type: 'ZOOM',
      fromValue: 1.2,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 1000,
      ease: 'easeOutCirc',
    },
  ],
  ONE_COLOR: [
    {
      type: 'ONE_COLOR',
      fromValue: 0,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 600,
      ease: 'easeInOutCubic',
    },
  ],
  MAIN_COLOR: [
    {
      type: 'MAIN_COLOR',
      fromValue: 0,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 600,
      ease: 'easeInOutCubic',
    },
  ],
  BLUR: [
    {
      type: 'BLUR',
      fromValue: 50,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      transitionDuration: 1000,
      ease: 'easeOutCubic',
    },
  ],
  FLOAT: [
    {
      type: 'SLIDE',
      fromValue: 100,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'EXIT',
      fromPosition: -200,
      toPosition: -600,
      iterations: 60,
      ease: 'easeInOutExpo',
      transitionDuration: 600,
      direction: 'IN',
    },
  ],
  SLIDE_LEFTWAY: [
    {
      type: 'SLIDE',
      fromValue: 250,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      ease: 'easeOutCubic',
      transitionDuration: 1000,
      direction: 'LEFTWAY',
    },
  ],
  SLIDE_RIGHTWAY: [
    {
      type: 'SLIDE',
      fromValue: 250,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 0,
      iterations: 1,
      ease: 'easeOutCubic',
      transitionDuration: 1000,
      direction: 'RIGHTWAY',
    },
  ],
  BLUR_AND_MAIN_COLOR: [
    {
      type: 'MAIN_COLOR',
      fromValue: 0,
      toValue: 1,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 0,
      toPosition: 300,
      iterations: 1,
      transitionDuration: 1000,
      ease: 'easeOutCubic',
    },
    {
      type: 'BLUR',
      fromValue: 80,
      toValue: 0,
      fromAnchor: 'ENTRY',
      toAnchor: 'ENTRY',
      fromPosition: 300,
      toPosition: 300,
      iterations: 1,
      transitionDuration: 1000,
      ease: 'easeOutCubic',
    },
  ],
};

export const advancedScrollAnimationConverter = (animation) => {
  return advancedAnimations[animation] || [];
};

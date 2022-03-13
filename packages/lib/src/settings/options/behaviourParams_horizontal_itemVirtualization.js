import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export const behaviourParams_gallery_horizontal_itemVirtualization_enabled = {
  title: 'Should Load Slideshow Items On Demand',
  description: `Enable this option to load slideshow items on demand.`,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal")',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
};

export const behaviourParams_gallery_horizontal_itemVirtualization_rightItemMargin =
  {
    title: 'Number Of Items Outside the View to Load On the Right As A Buffer',
    description: `Set the number of items outside the view to load on the right as a buffer.`,
    isRelevantDescription:
      'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable "Should Load Slideshow Items On Demand"',
    type: INPUT_TYPES.NUMBER,
    default: 3,
    isRelevant: (sp) =>
      sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      sp.behaviourParams.horizontal.itemVirtualization.enabled &&
      sp.slideAnimation !== GALLERY_CONSTS.slideAnimation.SCROLL,
  };

export const behaviourParams_gallery_horizontal_itemVirtualization_leftItemMargin =
  {
    title: 'Number Of Items Outside the View to Load On the Left As A Buffer',
    description: `Set the number of items outside the view to load on the left as a buffer.`,
    isRelevantDescription:
      'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable "Should Load Slideshow Items On Demand"',
    type: INPUT_TYPES.NUMBER,
    default: 3,
    isRelevant: (sp) =>
      sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      sp.behaviourParams.horizontal.itemVirtualization.enabled &&
      sp.slideAnimation !== GALLERY_CONSTS.slideAnimation.SCROLL,
  };

export const behaviourParams_gallery_horizontal_itemVirtualization_rightItemScrollMargin =
  {
    title:
      'Number Of Items Outside the View to Load On the Right As A Buffer For Scroll Animation',
    description: `Set the number of items outside the view to load on the right as a buffer for scroll animation.`,
    isRelevantDescription:
      'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable "Should Load Slideshow Items On Demand"',
    type: INPUT_TYPES.NUMBER,
    default: 10,
    isRelevant: (sp) =>
      sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      sp.behaviourParams.horizontal.itemVirtualization.enabled &&
      sp.slideAnimation === GALLERY_CONSTS.slideAnimation.SCROLL,
  };

export const behaviourParams_gallery_horizontal_itemVirtualization_leftItemScrollMargin =
  {
    title:
      'Number Of Items Outside the View to Load On the Left As A Buffer For Scroll Animation',
    description: `Set the number of items outside the view to load on the left as a buffer for scroll animation.`,
    isRelevantDescription:
      'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable "Should Load Slideshow Items On Demand"',
    type: INPUT_TYPES.NUMBER,
    default: 10,
    isRelevant: (sp) =>
      sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      sp.behaviourParams.horizontal.itemVirtualization.enabled &&
      sp.slideAnimation === GALLERY_CONSTS.slideAnimation.SCROLL,
  };

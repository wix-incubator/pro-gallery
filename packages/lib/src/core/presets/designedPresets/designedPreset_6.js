import LAYOUTS from '../../../common/constants/layout';
import SCROLL_ANIMATIONS from '../../../common/constants/scrollAnimations';
import IMAGE_HOVER_ANIMATIONS from '../../../common/constants/imageHoverAnimations';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_6,
  gallerySize: 60,
  minItemSize: 800,
  groupTypes: '1,2',
  rotatingGroupTypes: '2v,1,2v',
  cubeImages: true,
  groupsPerStrip: 3,
  imageMargin: 20,
  galleryMargin: 40,
  gridStyle: 1,
  scrollAnimation: SCROLL_ANIMATIONS.FADE_IN,
  imageHoverAnimation: IMAGE_HOVER_ANIMATIONS.ZOOM_IN,
  overlayBackground: 'rgba(8,8,8,0)',
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};

import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Size (pixels)',
  description: `Set the target size of each item in pixels. Notice that the actual size will change to fit the container size`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (sp) =>
    sp.gallerySizeType === GALLERY_CONSTS.gallerySizeType.PIXELS,
  isRelevantDescription: 'Set "Item Size Units" to "Pixels".',
  default: 500,
};

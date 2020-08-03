import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';


export default {
  title: 'Item Size Units',
  description: `Choose which units to use when setting the target size of each item: by layout, relative to width or in pixels (recommended)`,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.gallerySizeType.SMART,
  options: createOptions('gallerySizeType'),
  isRelevant: () => true,
}
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Size (relative to width)',
  description: `relative to width`,
  isRelevant: sp => sp.gallerySizeType === GALLERY_CONSTS.gallerySizeType.RATIO,
  default: 50,
}
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Size (smart)',
  description: `Set the item size between 1 to 100 units. The real size will be determined by the layout.`,
  isRelevant: sp => sp.gallerySizeType === GALLERY_CONSTS.gallerySizeType.SMART,
  default: 30,
}
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Size (relative to width)',
  description: `when "Item size unit" set to Ratio, "Item Size (relative to width)" represents the percentage that each item width should occupy from the width of the screen`,
  isRelevant: (sp) =>
    sp.gallerySizeType === GALLERY_CONSTS.gallerySizeType.RATIO,
  isRelevantDescription: 'Set "Item Size Units" to "Ratio".',
  default: 50,
};

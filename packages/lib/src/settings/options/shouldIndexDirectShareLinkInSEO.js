import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Search engines indexing for direct share links',
  description: `Choose whether you want the items with share link to be indexed by crawlers in SEO or not`,
  isRelevant: (sp) =>
    [
      GALLERY_CONSTS.itemClick.FULLSCREEN,
      GALLERY_CONSTS.itemClick.EXPAND,
    ].includes(sp.itemClick),
  isRelevantDescription:
    'Click Action (itemClick) must be set to "fullscreen" or "expand"',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};

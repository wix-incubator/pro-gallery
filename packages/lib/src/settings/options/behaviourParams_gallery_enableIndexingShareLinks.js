//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Search engines indexing for direct share links',
  description: `Choose whether you want the items with share link to be indexed by crawlers in SEO or not`,
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.clickAction] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
  isRelevantDescription:
    'Item Click Action must be an external Action (ACTION)',
  type: INPUT_TYPES.BOOLEAN,
  default: true, //NEW STYPEPARAMS METHOD one source
};

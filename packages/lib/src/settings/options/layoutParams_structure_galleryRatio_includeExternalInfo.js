import { default as galleryRatioValue } from './layoutParams_structure_galleryRatio_value.js';
import { INPUT_TYPES } from '../utils/constants.js';

import { isConstantVerticalPlacement, isHoverPlacement } from '../../common/constants/layoutParams_info_placement.js';
import optionsMap from '../../core/helpers/optionsMap.js';
export default {
  title: 'Include External Info in gallery Ratio',
  description: `Set to true with a single row horizontal gallery to include the external info (above or below) in the fixed gallery Ratio`,
  isRelevant: (options) => {
    const isSingleVerticalItemRendered =
      options[optionsMap.layoutParams.groups.repeatingGroupTypes].length > 1
        ? options[optionsMap.layoutParams.groups.repeatingGroupTypes].join('') === '1'
        : options[optionsMap.layoutParams.groups.allowedGroupTypes].join('') === '1';
    const filteredPlacement = options[optionsMap.layoutParams.info.placement] // filtering hover since it doesn't affect this
      .split(',')
      .filter((placement) => !isHoverPlacement(placement))
      .join(',');
    return (
      isSingleVerticalItemRendered &&
      isConstantVerticalPlacement(filteredPlacement) &&
      galleryRatioValue.isRelevant(options) &&
      options[optionsMap.layoutParams.structure.galleryRatio.value] > 0
    );
  },
  isRelevantDescription:
    'Must be a single row horizontal gallery with a provided galleryRatio value and a below/above info placement',
  default: false,
  type: INPUT_TYPES.BOOLEAN,
};

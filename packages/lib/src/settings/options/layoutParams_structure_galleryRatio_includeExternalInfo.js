import { default as galleryRatioValue } from './layoutParams_structure_galleryRatio_value';
import { INPUT_TYPES } from '../utils/constants';

import {
  isConstantVerticalPlacement,
  isHoverPlacement,
} from '../../common/constants/placements';
import optionsMap from '../../core/helpers/optionsMap';
export default {
  title: 'Include External Info in gallery Ratio',
  description: `Set to true with a single row horizontal gallery to include the external info (above or below) in the fixed gallery Ratio`,
  isRelevant: (options) => {
    if (options.newSPs) {
      const isSingleVerticalItemRendered = options[
        optionsMap.layoutParams.groups.repeatingGroupTypes
      ]
        ? options[optionsMap.layoutParams.groups.repeatingGroupTypes].join(
            ''
          ) === '1'
        : options[optionsMap.layoutParams.groups.allowedGroupTypes].join('') ===
          '1';
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
    } else {
      //NEW STYPEPARAMS METHOD need to convert to new sp
      const isSingleVerticalItemRendered = options.layoutParams
        .repeatingGroupTypes
        ? options.layoutParams.repeatingGroupTypes === '1'
        : options.groupTypes === '1';
      const filteredPlacement = options.titlePlacement // filtering hover since it doesn't affect this
        .split(',')
        .filter((placement) => !isHoverPlacement(placement))
        .join(',');
      return (
        isSingleVerticalItemRendered &&
        isConstantVerticalPlacement(filteredPlacement) &&
        galleryRatioValue.isRelevant(options) &&
        options.layoutParams.structure.galleryRatio.value > 0
      );
    }
  },
  isRelevantDescription:
    'Must be a single row horizontal gallery with a provided galleryRatio value and a below/above info placement',
  default: false,
  type: INPUT_TYPES.BOOLEAN,
};

import { default as galleryRatioValue } from './layoutParams_structure_galleryRatio_value';
import { default as optionsMap } from '../../core/helpers/optionsMap';
import {
  isConstantVerticalPlacement,
  isHoverPlacement,
} from '../../common/constants/placements';
export default {
  title: 'Include External Info in gallery Ratio',
  description: `Set to true with a single row horizontal gallery to include the external info (above or below) in the fixed gallery Ratio`,
  isRelevant: (options) => {
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
      options[optionsMap.structure.galleryRatio.value] > 0
    );
  },
  isRelevantDescription:
    'Must be a single row horizontal gallery with a provided galleryRatio value and a below/above info placement',
  default: false,
};

import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { default as arrowsPosition } from './layoutParams_navigationArrows_position';
import optionsMap from '../../core/helpers/optionsMap';
export default {
  title: 'Mouse Cursor Container Max Width',
  isRelevant: (options) => {
    return (
      arrowsPosition.isRelevant(options) &&
      options[optionsMap.layoutParams.navigationArrows.position] ===
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].MOUSE_CURSOR
    );
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Show Navigation Arrows" to "true" and set "Navigation Arrows Position" to "Mouse Cursor".',
  type: INPUT_TYPES.NUMBER,
  min: 10,
  max: 100,
  default: 100,
  description: `Set the size of the container mouse cursor in percentage.`,
};

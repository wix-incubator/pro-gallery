import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import behaviourParams_item_secondaryMedia_trigger from './behaviourParams_item_secondaryMedia_trigger';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Second Media Behaivour',
  isRelevant: (sp) =>
    behaviourParams_item_secondaryMedia_trigger.isRelevant(sp) && //NEW STYPEPARAMS METHOD need to flatten here
    sp.behaviourParams.item.secondaryMedia.trigger !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
        .OFF,
  isRelevantDescription:
    'Secondary Media Trigger is not "OFF" and when arrowsPosition is MOUSE_CURSOR there must be some space to hover (mouseCursorContainerMaxWidth less then 100)',
  type: INPUT_TYPES.OPTIONS,
  default:
    GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.behaviour]
      .APPEARS,
  options: createOptions(
    optionsMap.behaviourParams.item.secondaryMedia.behaviour
  ),
  description: `Select the behaviour for the second media on action.`,
};

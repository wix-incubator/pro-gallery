import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Gallery Control Panel Position',
  isRelevant: (options) => options.layoutParams.galeryControlPanel.enable,
  isRelevantDescription: 'Enable Gallery Control Panel',
  type: INPUT_TYPES.TEXT,
  default: 'OUTSIDE_GALLERY', //TODO replace with CONST
  description: `Set the position of the control panel. On Gallery will make the panel float on the gallery itself while Outside Gallery will have the panel adjecant to it`,
};

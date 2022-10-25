import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Gallery Control Panel alignment',
  isRelevant: (options) => options.galleryControlPanel.enable,
  isRelevantDescription: 'Enable Gallery Control Panel',
  type: INPUT_TYPES.TEXT,
  default: 'BOTTOM', //TODO replace with CONST
  description: `Set the alignment of the gallery Control Panel`,
};

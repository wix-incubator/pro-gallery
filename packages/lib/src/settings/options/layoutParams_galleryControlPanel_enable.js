import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Gallery Control Panel',
  isRelevant: () => true,
  isRelevantDescription: '',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Render a Gallery Control Panel (default is Thumbnails)`,
};

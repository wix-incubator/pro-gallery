import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Gallery Ratio',
  description: `This option allows horizontally scrolled galleries to link their height to the width of the gallery by the provided ratio`,
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal")',
  default: 0,
};

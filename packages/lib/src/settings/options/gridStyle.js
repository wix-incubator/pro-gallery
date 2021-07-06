import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Responsive Type',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical").',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.gridStyle.FIT_TO_SCREEN,
  options: createOptions('gridStyle'),
  description: `Choose between adjusting the number of columns according to the provided dimensions
  or setting it manually and keep it fixed.`,
  alert: 'This option will disable the responsive feature of the gallery!',
};

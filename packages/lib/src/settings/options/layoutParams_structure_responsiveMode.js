import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Responsive Type',
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL && //NEW STYPEPARAMS METHOD use new sps
    options.isVertical,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Layout Orientation" to "Columns".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.gridStyle.FIT_TO_SCREEN, //NEW STYPEPARAMS METHOD this is not a relevant type here
  options: createOptions('gridStyle'), //NEW STYPEPARAMS METHOD use responsiveMode new ENUM
  description: `Choose between adjusting the number of columns addording to the container
  size or setting it manually and keep it fixed.`,
  alert: 'This option will disable the responsive feature of the gallery!',
};

import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Align Direction in Grid Fit',
  description: `Align the items when crop type is FIT`,
  isRelevant: (sp) => sp.cubeImages && sp.cubeType === 'fit',
  isRelevantDescription: 'Set `Crop Images` to true and `Crop Type` to FIT',
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('cubeFitPosition'),
  default: GALLERY_CONSTS.cubeFitPosition.MIDDLE,
};

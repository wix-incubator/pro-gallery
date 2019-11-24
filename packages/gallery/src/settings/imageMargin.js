import { INPUT_TYPES } from './utils/constants';
import { imageMargin } from './utils/utils';

export default {
  title: 'Spacing Between Items',
  description: `Set the margin between items and control the spacing between them.
    This parameter does not necessarily use the CSS property "margin" in all layout cases(vertical layouts for example) to set the spacing, 
    some layout cases set the spacing by positioning the items absolutly in the gallery while taking into account
    the "imageMargin" value to create the spacing.`,
  isRelevant: imageMargin,
  type: INPUT_TYPES.NUMBER,
  default: 10,
}
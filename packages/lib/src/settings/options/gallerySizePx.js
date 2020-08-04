import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Item Size (pixels)',
  description: `Set the target size of each item in pixels. Notice that the actual size will change to fit the container size`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: () => true,
  default: 500,
}
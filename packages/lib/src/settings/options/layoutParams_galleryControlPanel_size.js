import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Gallery Control Panel Size',
  isRelevant: (options) => options.hasThumbnails,
  isRelevantDescription: 'Enable Gallery Control Panel',
  type: INPUT_TYPES.NUMBER,
  default: 120,
  min: 80,
  max: 300,
  description: `Set the Gallery Control Panel Size. This will account for the width on horizontal panel alignments and height on vertical ones
  `,
};

import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Size (smart)',
  description: `Set the item size between 1 to 100 units. The real size will be determined by the layout.`,
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    sp.gridStyle !== 1,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set Responsive Type to Fit to screen',
  default: 30,
};

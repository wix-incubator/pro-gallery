import { getOptionsFromUrl } from './options';
import { expect } from 'chai';

it('should return SP object from url', () => {
  const locationSearch =
    '?layoutParams_structure_galleryLayout=1&behaviourParams_item_overlay_hoveringBehaviour=ALWAYS_SHOW';
  const options = JSON.stringify(getOptionsFromUrl(locationSearch));
  const expected = JSON.stringify({
    layoutParams_structure_galleryLayout: 1,
    behaviourParams_item_overlay_hoveringBehaviour: 'ALWAYS_SHOW',
  });
  expect(options).to.equal(expected);
});

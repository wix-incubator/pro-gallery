import {getOptionsFromUrl} from './options'
it('should return SP object from url', () => {
  const locationSearch = '?layoutParams_structure_galleryLayout=1&behaviourParams_item_overlay_hoveringBehaviour=ALWAYS_SHOW'
  const options = getOptionsFromUrl(locationSearch)
  const expected = {
    "behaviourParams_item_overlay_hoveringBehaviour": "ALWAYS_SHOW",
    "layoutParams_structure_galleryLayout": 1
  }
  expect(options).toEqual(expected)
})

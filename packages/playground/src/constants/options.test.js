import {getOptionsFromUrl} from './options'
it('should return SP object from url', () => {
  const locationSearch = '?behaviourParams_item_overlay_hoveringBehaviour=ALWAYS_SHOW'
  const options = getOptionsFromUrl(locationSearch)
  const expected = {
    "behaviourParams_item_overlay_hoveringBehaviour": "ALWAYS_SHOW"
  }
  expect(options).toEqual(expected)
})

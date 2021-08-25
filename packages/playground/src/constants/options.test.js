import {getOptionsFromUrl} from './options'
it('should return SP object from url', () => {
  const locationSearch = '?hoveringBehaviour=NO_CHANGE'
  const styleParams = getOptionsFromUrl(locationSearch)
  const expected = {
    "hoveringBehaviour": "NO_CHANGE"
  }
  expect(styleParams).toEqual(expected)
})

import {getStyleParamsFromUrl} from './styleParams'
it('should return SP object from url', () => {
  const locationSearch = '?hoveringBehaviour=NO_CHANGE'
  const styleParams = getStyleParamsFromUrl(locationSearch)
  const expected = {
    "hoveringBehaviour": "NO_CHANGE"
  }
  expect(styleParams).toEqual(expected)
})

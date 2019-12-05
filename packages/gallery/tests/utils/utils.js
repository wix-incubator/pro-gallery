export const getBoundingClientRect = (elem) => {
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode())
  return {
    bottom: getPropNumber(top) + getPropNumber(height),
    right: getPropNumber(left) + getPropNumber(width)
  }
}
export const getPropNumber = (propValue) => Number(propValue.substring(0, propValue.indexOf('px')))
export const getCSSNumberValues = (elem) => {
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode());
  return {
    width: getPropNumber(width),
    top: getPropNumber(top),
    left: getPropNumber(left),
    height: getPropNumber(height)
  }
}
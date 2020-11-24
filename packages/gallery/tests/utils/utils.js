export const getBoundingClientRect = (elem) => {
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode());
  return {
    bottom: removePx(top) + removePx(height),
    right: removePx(left) + removePx(width),
  };
};
export const removePx = (value) =>
  Number(value.substring(0, value.indexOf('px')));

export const getElementDimensions = (elem) => {
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode());
  return {
    width: removePx(width),
    top: removePx(top),
    left: removePx(left),
    height: removePx(height),
  };
};

export const getElementStyles = (elem) => {
  return getComputedStyle(elem.getDOMNode());
};

function getDistanceFromScreen({ offset, scroll, itemStart, itemEnd, screenSize }) {
  const before = scroll - offset - itemEnd;
  const after = offset + itemStart - screenSize - scroll;
  return { before, after };
}

function isWithinPaddingVertically({ target, scrollBase, top, bottom, screenHeight, padding }) {
  const res = getDistanceFromScreen({
    offset: scrollBase || 0,
    scroll: target.scrollY,
    itemStart: top,
    itemEnd: bottom,
    screenSize: screenHeight,
  });
  return res.before < padding && res.after < padding;
}

function isWithinPaddingHorizontally({ target, left, right, screenWidth, padding }) {
  const res = getDistanceFromScreen({
    offset: 0,
    scroll: target.scrollLeft,
    itemStart: left,
    itemEnd: right,
    screenSize: screenWidth,
  });
  return res.before < padding && res.after < padding;
}

export { isWithinPaddingHorizontally, isWithinPaddingVertically };

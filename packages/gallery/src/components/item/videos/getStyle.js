module.exports = getStyle;

function getStyle(isCrop, isWiderThenContainer) {
  const CALC = 'calc(100% + 1px)';
  return isCrop ? getCrop() : getNonCrop();

  function getCrop() {
    return {
      height: isWiderThenContainer ? CALC : 'auto',
      width: isWiderThenContainer ? 'auto' : CALC,
      position: 'absolute',
      margin: 'auto',
      minHeight: '100%',
      minWidth: '100%',
      left: '-100%',
      right: '-100%',
      top: '-100%',
      bottom: '-100%',
    };
  }

  function getNonCrop() {
    return {
      width: isWiderThenContainer ? CALC : 'auto',
      height: isWiderThenContainer ? '100%' : CALC,
    };
  }
}

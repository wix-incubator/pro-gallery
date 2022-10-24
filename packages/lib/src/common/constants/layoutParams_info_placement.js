//NEW STYPEPARAMS METHOD
const PLACEMENTS = {
  OVERLAY: 'OVERLAY',
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALTERNATE_HORIZONTALLY: 'ALTERNATE_HORIZONTALLY',
  ALTERNATE_VERTICALLY: 'ALTERNATE_VERTICALLY',
};

const hasHoverPlacement = (placement) =>
  String(placement).includes(PLACEMENTS.OVERLAY);
const hasExternalAbovePlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.ABOVE) ||
  (idx % 2 === 0 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_VERTICALLY));
const hasExternalBelowPlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.BELOW) ||
  (idx % 2 === 1 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_VERTICALLY));
const hasExternalRightPlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.RIGHT) ||
  idx % 2 === 0 ||
  String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTALLY);
const hasExternalLeftPlacement = (placement, idx) =>
  idx % 2 === 1 ||
  String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTALLY);
const hasExternalVerticalPlacement = (placement) =>
  hasExternalAbovePlacement(placement, 0) ||
  hasExternalBelowPlacement(placement, 1);
const hasExternalHorizontalPlacement = (placement) =>
  hasExternalRightPlacement(placement, 0) ||
  hasExternalLeftPlacement(placement, 1);

const isExternalVerticalPlacement = (placement) =>
  hasExternalVerticalPlacement(placement) &&
  !hasExternalHorizontalPlacement(placement) &&
  !hasHoverPlacement(placement);
const isExternalHorizontalPlacement = (placement) =>
  hasExternalHorizontalPlacement(placement) &&
  !hasExternalVerticalPlacement(placement) &&
  !hasHoverPlacement(placement);
const isExternalAbovePlacement = (placement) =>
  String(placement) === PLACEMENTS.ABOVE;
const isExternalBelowPlacement = (placement) =>
  String(placement) === PLACEMENTS.BELOW;
const isExternalAboveOrBelowSinglePlacement = (placement) =>
  isExternalAbovePlacement(placement) || isExternalBelowPlacement(placement);
const isHoverPlacement = (placement) =>
  String(placement) === PLACEMENTS.OVERLAY;
const isExternalRightPlacement = (placement) =>
  String(placement) === PLACEMENTS.RIGHT;
const isExternalLeftPlacement = (placement) =>
  String(placement) === PLACEMENTS.LEFT;

const isConstantVerticalPlacement = (placement) => {
  const placementArray = placement.split(',');
  const firstPlacement = placementArray.shift();
  return (
    isExternalAboveOrBelowSinglePlacement(firstPlacement) &&
    placementArray.every((placement) => placement === firstPlacement)
  );
};

export default PLACEMENTS;

export {
  hasExternalAbovePlacement,
  hasExternalBelowPlacement,
  hasHoverPlacement,
  hasExternalRightPlacement,
  hasExternalLeftPlacement,
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
  isExternalAbovePlacement,
  isExternalBelowPlacement,
  isHoverPlacement,
  isExternalRightPlacement,
  isExternalLeftPlacement,
  isExternalVerticalPlacement,
  isExternalHorizontalPlacement,
  isConstantVerticalPlacement,
};

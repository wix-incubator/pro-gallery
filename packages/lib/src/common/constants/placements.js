const PLACEMENTS = {
  SHOW_ON_HOVER: 'SHOW_ON_HOVER',
  SHOW_BELOW: 'SHOW_BELOW',
  SHOW_ABOVE: 'SHOW_ABOVE',
  SHOW_ON_THE_RIGHT: 'SHOW_ON_THE_RIGHT',
  SHOW_ON_THE_LEFT: 'SHOW_ON_THE_LEFT',
};

const hasAbovePlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ABOVE) >= 0;
const hasBelowPlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_BELOW) >= 0;
const hasHoverPlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_HOVER) >= 0;
const hasRightPlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_RIGHT) >= 0;
const hasLeftPlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_LEFT) >= 0;
const hasVerticalPlacement = (placement) =>
  hasAbovePlacement(placement) || hasBelowPlacement(placement);
const hasHorizontalPlacement = (placement) =>
  hasRightPlacement(placement) || hasLeftPlacement(placement);

const isVerticalPlacement = (placement) =>
  (hasAbovePlacement(placement) || hasBelowPlacement(placement)) &&
  !hasHorizontalPlacement(placement) &&
  !hasHoverPlacement(placement);
const isHorizontalPlacement = (placement) =>
  (hasRightPlacement(placement) || hasLeftPlacement(placement)) &&
  !hasVerticalPlacement(placement) &&
  !hasHoverPlacement(placement);
const isAbovePlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ABOVE;
const isBelowPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_BELOW;
const isHoverPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_HOVER;
const isRightPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_RIGHT;
const isLeftPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_LEFT;

export default PLACEMENTS;

export {
  hasAbovePlacement,
  hasBelowPlacement,
  hasHoverPlacement,
  hasRightPlacement,
  hasLeftPlacement,
  hasVerticalPlacement,
  hasHorizontalPlacement,
  isAbovePlacement,
  isBelowPlacement,
  isHoverPlacement,
  isRightPlacement,
  isLeftPlacement,
  isVerticalPlacement,
  isHorizontalPlacement,
};

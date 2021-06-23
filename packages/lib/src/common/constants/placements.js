const PLACEMENTS = {
  SHOW_ON_HOVER: 'SHOW_ON_HOVER',
  SHOW_BELOW: 'SHOW_BELOW',
  SHOW_ABOVE: 'SHOW_ABOVE',
  SHOW_ON_THE_RIGHT: 'SHOW_ON_THE_RIGHT',
  SHOW_ON_THE_LEFT: 'SHOW_ON_THE_LEFT',
  ALTERNATE_HORIZONTAL: 'ALTERNATE_HORIZONTAL',
  ALTERNATE_VERTICAL: 'ALTERNATE_VERTICAL',
};

const hasHoverPlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_HOVER) >= 0;
const hasAbovePlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ABOVE) >= 0 ||
  (idx % 2 === 0 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_VERTICAL) >= 0);
const hasBelowPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_BELOW) >= 0 ||
  (idx % 2 === 1 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_VERTICAL) >= 0);
const hasRightPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_RIGHT) >= 0 ||
  (idx % 2 === 0 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_HORIZONTAL) >= 0);
const hasLeftPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_LEFT) >= 0 ||
  (idx % 2 === 1 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_HORIZONTAL) >= 0);
const hasVerticalPlacement = (placement) =>
  hasAbovePlacement(placement, 0) || hasBelowPlacement(placement, 1);
const hasHorizontalPlacement = (placement) =>
  hasRightPlacement(placement, 0) || hasLeftPlacement(placement, 1);

const isVerticalPlacement = (placement) =>
  hasVerticalPlacement(placement) &&
  !hasHorizontalPlacement(placement) &&
  !hasHoverPlacement(placement);
const isHorizontalPlacement = (placement) =>
  hasHorizontalPlacement(placement) &&
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

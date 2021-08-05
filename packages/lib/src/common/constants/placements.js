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
const hasExternalAbovePlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ABOVE) >= 0 ||
  (idx % 2 === 0 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_VERTICAL) >= 0);
const hasExternalBelowPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_BELOW) >= 0 ||
  (idx % 2 === 1 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_VERTICAL) >= 0);
const hasExternalVerticalAlternatePlacement = (placement) =>
  String(placement).indexOf(PLACEMENTS.ALTERNATE_VERTICAL) >= 0;
const hasExternalRightPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_RIGHT) >= 0 ||
  (idx % 2 === 0 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_HORIZONTAL) >= 0);
const hasExternalLeftPlacement = (placement, idx) =>
  String(placement).indexOf(PLACEMENTS.SHOW_ON_THE_LEFT) >= 0 ||
  (idx % 2 === 1 &&
    String(placement).indexOf(PLACEMENTS.ALTERNATE_HORIZONTAL) >= 0);
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
  String(placement) === PLACEMENTS.SHOW_ABOVE;
const isExternalBelowPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_BELOW;
const isHoverPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_HOVER;
const isExternalRightPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_RIGHT;
const isExternalLeftPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_LEFT;
const isHoverAndExternalVerticalPlacement = (placement) => {
  let placementArray = String(placement).split(',');
  return (
    placementArray.length === 2 &&
    hasExternalVerticalPlacement(placement) &&
    hasHoverPlacement(placement)
  );
};

// Gets placement and isSlideshow from current style, returns whether there's a vertical info placement
const isVerticalPlacement = (placement, isSlideshow) => {
  return (
    isExternalBelowPlacement(placement) ||
    isExternalAbovePlacement(placement) ||
    isHoverAndExternalVerticalPlacement(placement) ||
    isSlideshow
  );
};

export default PLACEMENTS;

export {
  hasExternalAbovePlacement,
  hasExternalBelowPlacement,
  hasExternalVerticalAlternatePlacement,
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
  isVerticalPlacement,
};

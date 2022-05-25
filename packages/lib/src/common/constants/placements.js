const PLACEMENTS = {
  SHOW_ON_HOVER: 'SHOW_ON_HOVER',
  SHOW_BELOW: 'SHOW_BELOW',
  SHOW_ABOVE: 'SHOW_ABOVE',
  SHOW_ON_THE_RIGHT: 'SHOW_ON_THE_RIGHT',
  SHOW_ON_THE_LEFT: 'SHOW_ON_THE_LEFT',
  ALTERNATE_HORIZONTAL: 'ALTERNATE_HORIZONTAL',
  ALTERNATE_VERTICAL: 'ALTERNATE_VERTICAL',
};

const NEW_PLACEMENTS = {
  OVERLAY: 'OVERLAY',
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALTERNATE_HORIZONTALLY: 'ALTERNATE_HORIZONTALLY',
  ALTERNATE_VERTICALLY: 'ALTERNATE_VERTICALLY',
};

const hasHoverPlacement = (placement) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_HOVER) ||
  String(placement).includes(NEW_PLACEMENTS.OVERLAY);
const hasExternalAbovePlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.SHOW_ABOVE) ||
  String(placement).includes(NEW_PLACEMENTS.ABOVE) ||
  (idx % 2 === 0 &&
    (String(placement).includes(PLACEMENTS.ALTERNATE_VERTICAL) ||
      String(placement).includes(NEW_PLACEMENTS.ALTERNATE_VERTICALLY)));
const hasExternalBelowPlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.SHOW_BELOW) ||
  String(placement).includes(NEW_PLACEMENTS.BELOW) ||
  (idx % 2 === 1 &&
    (String(placement).includes(PLACEMENTS.ALTERNATE_VERTICAL) ||
      String(placement).includes(NEW_PLACEMENTS.ALTERNATE_VERTICALLY)));
const hasExternalRightPlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_THE_RIGHT) ||
  String(placement).includes(NEW_PLACEMENTS.RIGHT) ||
  (idx % 2 === 0 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTAL)) ||
  String(placement).includes(NEW_PLACEMENTS.ALTERNATE_HORIZONTALLY);
const hasExternalLeftPlacement = (placement, idx) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_THE_LEFT) ||
  (idx % 2 === 1 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTAL)) ||
  String(placement).includes(NEW_PLACEMENTS.ALTERNATE_HORIZONTALLY);
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
  String(placement) === PLACEMENTS.SHOW_ABOVE ||
  String(placement) === NEW_PLACEMENTS.ABOVE;
const isExternalBelowPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_BELOW ||
  String(placement) === NEW_PLACEMENTS.BELOW;
const isExternalAboveOrBelowSinglePlacement = (placement) =>
  isExternalAbovePlacement(placement) || isExternalBelowPlacement(placement);
const isHoverPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_HOVER ||
  String(placement) === NEW_PLACEMENTS.OVERLAY;
const isExternalRightPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_RIGHT ||
  String(placement) === NEW_PLACEMENTS.RIGHT;
const isExternalLeftPlacement = (placement) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_LEFT ||
  String(placement) === NEW_PLACEMENTS.LEFT;

const isConstantVerticalPlacement = (placement, isSlideshow) => {
  const placementArray = placement.split(',');
  const firstPlacement = placementArray.shift();
  return (
    isSlideshow || // Either SlideShow OR all placements are above/below (the same as the first one)
    (isExternalAboveOrBelowSinglePlacement(firstPlacement) &&
      placementArray.every((placement) => placement === firstPlacement))
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

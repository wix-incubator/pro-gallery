const PLACEMENTS = {
  SHOW_ON_HOVER: 'SHOW_ON_HOVER',
  SHOW_BELOW: 'SHOW_BELOW',
  SHOW_ABOVE: 'SHOW_ABOVE',
  SHOW_ON_THE_RIGHT: 'SHOW_ON_THE_RIGHT',
  SHOW_ON_THE_LEFT: 'SHOW_ON_THE_LEFT',
  ALTERNATE_HORIZONTAL: 'ALTERNATE_HORIZONTAL',
  ALTERNATE_VERTICAL: 'ALTERNATE_VERTICAL',
} as const;

const NEW_PLACEMENTS = {
  OVERLAY: 'OVERLAY',
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALTERNATE_HORIZONTALLY: 'ALTERNATE_HORIZONTALLY',
  ALTERNATE_VERTICALLY: 'ALTERNATE_VERTICALLY',
} as const;

export const hasHoverPlacement = (placement: string) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_HOVER) ||
  String(placement).includes(NEW_PLACEMENTS.OVERLAY);

export const hasExternalAbovePlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.SHOW_ABOVE) ||
  String(placement).includes(NEW_PLACEMENTS.ABOVE) ||
  (idx % 2 === 0 &&
    (String(placement).includes(PLACEMENTS.ALTERNATE_VERTICAL) ||
      String(placement).includes(NEW_PLACEMENTS.ALTERNATE_VERTICALLY)));

export const hasExternalBelowPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.SHOW_BELOW) ||
  String(placement).includes(NEW_PLACEMENTS.BELOW) ||
  (idx % 2 === 1 &&
    (String(placement).includes(PLACEMENTS.ALTERNATE_VERTICAL) ||
      String(placement).includes(NEW_PLACEMENTS.ALTERNATE_VERTICALLY)));

export const hasExternalRightPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_THE_RIGHT) ||
  String(placement).includes(NEW_PLACEMENTS.RIGHT) ||
  (idx % 2 === 0 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTAL)) ||
  String(placement).includes(NEW_PLACEMENTS.ALTERNATE_HORIZONTALLY);

export const hasExternalLeftPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.SHOW_ON_THE_LEFT) ||
  (idx % 2 === 1 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTAL)) ||
  String(placement).includes(NEW_PLACEMENTS.ALTERNATE_HORIZONTALLY);

export const hasExternalVerticalPlacement = (placement: string) =>
  hasExternalAbovePlacement(placement, 0) ||
  hasExternalBelowPlacement(placement, 1);

export const hasExternalHorizontalPlacement = (placement: string) =>
  hasExternalRightPlacement(placement, 0) ||
  hasExternalLeftPlacement(placement, 1);

export const isExternalVerticalPlacement = (placement: string) =>
  hasExternalVerticalPlacement(placement) &&
  !hasExternalHorizontalPlacement(placement) &&
  !hasHoverPlacement(placement);

export const isExternalHorizontalPlacement = (placement: string) =>
  hasExternalHorizontalPlacement(placement) &&
  !hasExternalVerticalPlacement(placement) &&
  !hasHoverPlacement(placement);

export const isExternalAbovePlacement = (placement?: string) =>
  String(placement) === PLACEMENTS.SHOW_ABOVE ||
  String(placement) === NEW_PLACEMENTS.ABOVE;

export const isExternalBelowPlacement = (placement?: string) =>
  String(placement) === PLACEMENTS.SHOW_BELOW ||
  String(placement) === NEW_PLACEMENTS.BELOW;

export const isExternalAboveOrBelowSinglePlacement = (placement?: string) =>
  isExternalAbovePlacement(placement) || isExternalBelowPlacement(placement);

export const isHoverPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.SHOW_ON_HOVER ||
  String(placement) === NEW_PLACEMENTS.OVERLAY;

export const isExternalRightPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_RIGHT ||
  String(placement) === NEW_PLACEMENTS.RIGHT;

export const isExternalLeftPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.SHOW_ON_THE_LEFT ||
  String(placement) === NEW_PLACEMENTS.LEFT;

export const isConstantVerticalPlacement = (placement: string) => {
  const placementArray = placement.split(',');
  const firstPlacement = placementArray.shift();

  return (
    isExternalAboveOrBelowSinglePlacement(firstPlacement) &&
    placementArray.every((placement) => placement === firstPlacement)
  );
};

export default PLACEMENTS;

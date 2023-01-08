const PLACEMENTS = {
  OVERLAY: 'OVERLAY',
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  ALTERNATE_HORIZONTALLY: 'ALTERNATE_HORIZONTALLY',
  ALTERNATE_VERTICALLY: 'ALTERNATE_VERTICALLY',
};
export const hasHoverPlacement = (placement: string) =>
  String(placement).includes(PLACEMENTS.OVERLAY);

export const hasExternalAbovePlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.ABOVE) ||
  (idx % 2 === 0 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_VERTICALLY));

export const hasExternalBelowPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.BELOW) ||
  (idx % 2 === 1 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_VERTICALLY));

export const hasExternalRightPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.RIGHT) ||
  (idx % 2 === 0 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTALLY));

export const hasExternalLeftPlacement = (placement: string, idx: number) =>
  String(placement).includes(PLACEMENTS.LEFT) ||
  (idx % 2 === 1 &&
    String(placement).includes(PLACEMENTS.ALTERNATE_HORIZONTALLY));

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
  String(placement) === PLACEMENTS.ABOVE;

export const isExternalBelowPlacement = (placement?: string) =>
  String(placement) === PLACEMENTS.BELOW;

export const isExternalAboveOrBelowSinglePlacement = (placement?: string) =>
  isExternalAbovePlacement(placement) || isExternalBelowPlacement(placement);

export const isHoverPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.OVERLAY;

export const isExternalRightPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.RIGHT;

export const isExternalLeftPlacement = (placement: string) =>
  String(placement) === PLACEMENTS.LEFT;

export const isConstantVerticalPlacement = (placement: string) => {
  const placementArray = placement.split(',');
  const firstPlacement = placementArray.shift();

  return (
    isExternalAboveOrBelowSinglePlacement(firstPlacement) &&
    placementArray.every((placement) => placement === firstPlacement)
  );
};

export default PLACEMENTS;

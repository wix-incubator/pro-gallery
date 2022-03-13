import { ItemProps, RelationToViewport } from '../types/item';
import { useSettings } from './gallery';

export function getDistanceToViewport(
  props: Pick<ItemProps, 'container' | 'location' | 'galleryStructure'>
): { distance: number; placement: RelationToViewport } {
  const { container, location } = props;
  const isVertical = true;
  const itemLocation = isVertical ? location.top : location.left;
  const containerSize = isVertical
    ? container.clientHeight
    : container.clientWidth;
  const containerScroll = isVertical
    ? container.scrollTop
    : container.scrollLeft;
  const containerBottom = containerScroll + containerSize;
  const itemTop = itemLocation + location.height;

  if (containerBottom > itemLocation && containerScroll <= itemTop) {
    return {
      distance: 0,
      placement: 'inside',
    };
  }
  if (containerBottom <= itemLocation) {
    return {
      distance: itemLocation - containerBottom,
      placement: 'below',
    };
  }
  return {
    distance: containerScroll - itemTop,
    placement: 'above',
  };
}

export function useInViewport(distanceToViewport: number) {
  const settings = useSettings();
  const { layoutParams } = settings;
  const { viewportThreshold } = layoutParams;
  return Math.abs(distanceToViewport) <= viewportThreshold;
}

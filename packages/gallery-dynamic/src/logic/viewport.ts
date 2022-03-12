import { ItemProps } from '../types/item';
import { useSettings } from './gallery';

export function useDistanceToViewport(
  props: Pick<ItemProps, 'container' | 'location' | 'galleryStructure'>
) {
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
  if (containerBottom > itemLocation && containerScroll < itemLocation) {
    return 0;
  }
  if (containerBottom <= itemLocation) {
    return itemLocation - containerBottom;
  }
  if (containerScroll >= itemLocation) {
    return containerScroll - itemLocation;
  }
  return 0;
}

export function useInViewport(distanceToViewport: number) {
  const settings = useSettings();
  const { layoutParams } = settings;
  const { viewportThreshold } = layoutParams;
  return Math.abs(distanceToViewport) <= viewportThreshold;
}

import { ItemProps } from '../types/item';
import { useSettings } from './gallery';

export function useDistanceToViewport(
  props: Pick<ItemProps, 'container' | 'location' | 'galleryStructure'>
) {
  const { container, location, galleryStructure } = props;
  const isVertical = galleryStructure.direction === 'VERTICAL';
  const itemLocation = isVertical ? location.top : location.left;
  const containerSize = isVertical
    ? container.clientHeight
    : container.clientWidth;
  const containerScroll = isVertical
    ? container.scrollTop
    : container.scrollLeft;
  const containerBottom = containerScroll + containerSize;
  return itemLocation - containerBottom;
}

export function useInViewport(distanceToViewport: number) {
  const settings = useSettings();
  const { layoutParams } = settings;
  const { viewportThreshold } = layoutParams;
  return distanceToViewport <= viewportThreshold;
}

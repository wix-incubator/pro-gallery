import { useState } from 'react';
import { useItemMotion } from '../logic/animation';
import { createImageSource, useImageState } from '../logic/image';
import { getDistanceToViewport, useInViewport } from '../logic/viewport';
import { ItemProps } from '../types/item';

export function useItem(props: ItemProps) {
  const { item, location, galleryStructure, container, styling } = props;
  const [isHover, setHover] = useState(false);
  const { distance, placement } = getDistanceToViewport({
    location,
    galleryStructure,
    container,
  });
  const isInViewport = useInViewport(distance);
  const { backgroundLoadStep, imageLoadStep, isLazy } = useImageState(
    distance,
    placement
  );
  const backgroundImageSrc =
    backgroundLoadStep && createImageSource(item, backgroundLoadStep, location);
  const imageSrc = createImageSource(item, imageLoadStep, location);

  const { contentMotion, containerMotion } = useItemMotion({
    itemStyling: styling,
    distanceToViewport: distance,
    placement,
    location,
    isHover,
  });
  return {
    isInViewport,
    contentMotion,
    containerMotion,
    setHover,
    image: {
      src: imageSrc,
      backgroundSrc: backgroundImageSrc,
      isLazy,
    },
  };
}

import { IItem } from '../types/gallery';
import { ItemLocation, RelationToViewport } from '../types/item';
import { useSettings } from './gallery';

const loadSteps = {
  initial: 0.005,
  lazy: 0.8,
  full: 1,
};

export function useImageState(
  distanceToViewport: number,
  placement: RelationToViewport
) {
  const settings = useSettings();
  const { imageLoadThreshold, imageForceLoadThreshold } = settings.layoutParams;
  const isLoaded = distanceToViewport < imageLoadThreshold;
  const lazyLoad =
    distanceToViewport > imageForceLoadThreshold && placement !== 'above';
  let loadStep = loadSteps.initial;
  if (isLoaded) {
    if (lazyLoad) {
      loadStep = loadSteps.lazy;
    } else {
      loadStep = loadSteps.full;
    }
  }
  return {
    backgroundLoadStep: loadSteps.initial,
    imageLoadStep: loadStep,
    isLazy: lazyLoad,
  };
}

export function generateImageResolution(location: ItemLocation, res: number) {
  const { width, height } = location;
  const loadWidth = Math.round(width * res);
  const loadHeight = Math.round(height * res);
  return {
    width: loadWidth,
    height: loadHeight,
  };
}

// TO DO Replace with real image src
export function createImageSource(
  _item: IItem,
  res: number,
  location: ItemLocation
): string {
  // const { id } = _item;
  const { width, height } = generateImageResolution(location, res);
  // return `https://picsum.photos/id/${id}/${width}/${height}.webp`;
  return `https://placekitten.com/${width}/${height}`;
}

import { IItem } from '../types/gallery';
import { useSettings } from './gallery';

const loadSteps = {
  initial: 0.2,
  lazy: 0.8,
  full: 1,
};

export function useImageState(distanceToViewport: number) {
  const settings = useSettings();
  const { imageLoadThreshold, imageForceLoadThreshold } = settings.layoutParams;
  const isLoaded = distanceToViewport <= imageLoadThreshold;
  const lazyLoad = distanceToViewport <= imageForceLoadThreshold;
  let loadStep = loadSteps.initial;
  let previusLoadStep: number | undefined;
  if (isLoaded) {
    if (lazyLoad) {
      loadStep = loadSteps.lazy;
      previusLoadStep = loadSteps.initial;
    } else {
      loadStep = loadSteps.full;
      previusLoadStep = loadSteps.lazy;
    }
  }
  return {
    backgroundLoadStep: previusLoadStep,
    imageLoadStep: loadStep,
    isLazy: lazyLoad,
  };
}

export function generateImageResolution(item: IItem, res: number) {
  const { metaData } = item;
  const { width, height } = metaData;
  const loadWidth = Math.round(width * res);
  const loadHeight = Math.round(height * res);
  return {
    width: loadWidth,
    height: loadHeight,
  };
}

// TO DO Replace with real image src
export function createImageSource(item: IItem, res: number): string {
  const { id } = item;
  const { width, height } = generateImageResolution(item, res);
  return `https://picsum.photos/${id}/${width}/${height}`;
}

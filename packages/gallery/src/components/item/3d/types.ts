import { ThreeDimensionalScene } from 'pro-gallery-lib';
import { MediaImplementationProps } from '../media/mediaItem.js';

export type ThreeDProps = {
  itemContainer: React.RefObject<HTMLDivElement>;
  scene: ThreeDimensionalScene;
};

export type ThreeDImplementation = MediaImplementationProps<ThreeDProps>;

import React from 'react';
import { ThreeDProps } from './types.js';
import MediaItem, { MediaProps } from '../media/mediaItem.js';
import { optionsMap } from 'pro-gallery-lib';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ThreeDItem = React.lazy(() => import(/* webpackChunkName: "ThreeDItem" */ './3dItem.js'));

export default function ThreeDItemWrapper(
  props: Omit<
    MediaProps<ThreeDProps>,
    'MediaImplementation' | 'enableImagePlaceholder' | 'showPlayButton' | 'placeholderExtraClasses'
  >
): JSX.Element {
  const { options } = props;
  const playTrigger = options[optionsMap.behaviourParams.item.threeDimensionalScene.playTrigger];
  const showVideoPlayButton = options[optionsMap.behaviourParams.item.threeDimensionalScene.enablePlayButton];
  return (
    <MediaItem
      {...props}
      MediaImplementation={ThreeDItem}
      playTrigger={playTrigger}
      placeholderExtraClasses={['gallery-item-3d-placeholder']}
      enableImagePlaceholder={true}
      showPlayButton={showVideoPlayButton}
    />
  );
}

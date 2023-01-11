/* eslint-disable @typescript-eslint/ban-types */
import React, { useMemo } from 'react';
import { optionsMap, GALLERY_CONSTS } from 'pro-gallery-lib';
import { VideoPlayButton } from '../../helpers/play-button';
import { Options, Settings, PlayTrigger } from 'pro-gallery-lib';
import ImageItem from '../imageItem';

export type MediaBaseProps = {
  calculatedAlt: string;
  title: string;
  description: string;
  id: string;
  idx: number;
  activeIndex: number;
  isCurrentHover: boolean;
  options: Options;
  createUrl: any;
  createMagnifiedUrl: any;
  settings: Settings;
  isPrerenderMode: boolean;
  isTransparent: boolean;
  style: any;
  itemContainer?: HTMLDivElement;
  actions: any;
  customComponents: any;
  shouldPlay: boolean;
  imageDimensions: any;
  playTrigger: PlayTrigger;
  hasLink: boolean;
  placeholderExtraClasses: string[];
  showPlayButton: boolean;
  hover: JSX.Element;
  enableImagePlaceholder: boolean;
};

export type MediaProps<T extends Record<string, any>> = MediaBaseProps & {
  MediaImplementation: React.ComponentType<
    MediaImplementationProps<Omit<T, 'MediaImplementation'>>
  >;
} & T;

export type MediaImplementationProps<T = {}> = T &
  MediaBaseProps & {
    thumbnail: JSX.Element;
    placeholder: JSX.Element;
  };

export default function MediaItem<T extends Record<string, any>>(
  props: MediaProps<T>
): JSX.Element {
  const {
    hasLink,
    playTrigger,
    options,
    imageDimensions,
    showPlayButton,
    MediaImplementation,
    enableImagePlaceholder,
  } = props;
  const { behaviourParams_item_clickAction: clickAction } = options;

  const isMediaPlayable = useMemo(() => {
    if (
      playTrigger ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger]
          .HOVER ||
      playTrigger ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO
    ) {
      return true;
    } else if (
      clickAction ===
      GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING
    ) {
      return true;
    } else if (
      clickAction ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK &&
      !hasLink
    ) {
      return true;
    }
    // }
    return false;
  }, [hasLink, playTrigger, clickAction]);

  const thumbnail = enableImagePlaceholder ? (
    <ImageItem
      {...props}
      imageDimensions={imageDimensions}
      id={props.idx}
      overlay={
        showPlayButton &&
        !isMediaPlayable && <VideoPlayButton pointerEvents={true} />
      }
      extraClasses={' ' + props.placeholderExtraClasses.join(' ')}
    />
  ) : (
    <></>
  );

  const placeholder = (
    <>
      {thumbnail}
      {props.hover}
    </>
  );
  if (!isMediaPlayable) {
    return placeholder;
  }

  return (
    <React.Suspense fallback={placeholder}>
      <MediaImplementation
        {...props}
        thumbnail={thumbnail}
        placeholder={placeholder}
      />
    </React.Suspense>
  );
}

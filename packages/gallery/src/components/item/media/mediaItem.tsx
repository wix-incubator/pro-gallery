/* eslint-disable @typescript-eslint/ban-types */
import React, { useMemo } from 'react';
import { optionsMap, GALLERY_CONSTS, isEditMode } from 'pro-gallery-lib';
import { VideoPlayButton } from './playButton';
import { Options, Settings, utils } from 'pro-gallery-lib';
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
  actions: any;
  customComponents: any;
  shouldPlay: boolean;
  imageDimensions: any;
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
    thumbnailWithOverride(props: ImageItem['props']): JSX.Element;
    placeholder: JSX.Element;
  };

export default function MediaItem<T extends Record<string, any>>(
  props: MediaProps<T>
): JSX.Element {
  const {
    hasLink,
    options,
    imageDimensions,
    showPlayButton,
    MediaImplementation,
    enableImagePlaceholder,
  } = props;
  const {
    behaviourParams_item_clickAction: clickAction,
    behaviourParams_item_video_playTrigger: playTrigger,
  } = options;

  const isMediaPlayable = useMemo(() => {
    if (utils.isSSR()) {
      return false;
    }

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
    return false;
  }, [hasLink, playTrigger, clickAction]);

  const createThumbnail = (propsOverrides: any = {}) =>
    enableImagePlaceholder ? (
      <ImageItem
        {...props}
        imageDimensions={imageDimensions}
        id={props.idx}
        overlay={showPlayButton && !isMediaPlayable && <VideoPlayButton />}
        extraClasses={props.placeholderExtraClasses.join(' ')}
        {...propsOverrides}
      />
    ) : (
      <></>
    );
  const thumbnail = createThumbnail();

  const placeholder = (
    <>
      {thumbnail}
      {props.hover}
    </>
  );
  if (!isMediaPlayable) {
    return placeholder;
  }

  if (isEditMode()) {
    return thumbnail;
  }

  return (
    <React.Suspense fallback={placeholder}>
      <MediaImplementation
        {...props}
        thumbnail={thumbnail}
        placeholder={placeholder}
        thumbnailWithOverride={createThumbnail}
      />
    </React.Suspense>
  );
}

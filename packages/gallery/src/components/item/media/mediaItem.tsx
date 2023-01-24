/* eslint-disable @typescript-eslint/ban-types */
import React, { useMemo } from 'react';
import { optionsMap, GALLERY_CONSTS, isEditMode } from 'pro-gallery-lib';
import { VideoPlayButton } from './playButton';
import { Options, Settings } from 'pro-gallery-lib';
import ImageItem from '../imageItem';
import IframeVideoPlayer from '../videos/IframeVideoPlayer';

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

  const createIframePlayer = (propsOverrides: any = {}) => (
    <IframeVideoPlayer
      {...props}
      dimensions={imageDimensions}
      overlay={showPlayButton && !isMediaPlayable && <VideoPlayButton />}
      extraClasses={props.placeholderExtraClasses.join(' ')}
      url="https://www.youtube.com/embed/KvZT3etZIsw?autoplay=0&mute=0&controls=1&origin=https%3A%2F%2Fmoshemay6.wixsite.com&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widgetid=1"
      {...propsOverrides}
    />
  );
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
  const iframeVideoPlayer = createIframePlayer();
  const placeholder = (
    <>
      {thumbnail}
      {iframeVideoPlayer}
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
console.log('LOCAL');

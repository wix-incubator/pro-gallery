/* eslint-disable @typescript-eslint/ban-types */
import React, { useMemo, useEffect, useState } from 'react';
import { optionsMap, GALLERY_CONSTS, isEditMode } from 'pro-gallery-lib';
import { GalleryUI } from './GalleryUI.js';
import { Options, Settings, utils } from 'pro-gallery-lib';
import ImageItem from '../imageItem.js';
import IframeVideoPlayer from '../videos/IframeVideoPlayer.js';

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
  MediaImplementation: React.ComponentType<MediaImplementationProps<Omit<T, 'MediaImplementation'>>>;
} & T;

export type MediaImplementationProps<T = {}> = T &
  MediaBaseProps & {
    thumbnail: JSX.Element;
    thumbnailWithOverride(props: ImageItem['props']): JSX.Element;
    placeholder: JSX.Element;
  };

const getPlayButtonComponentByItemType = (type: string) => {
  if (type === 'video') {
    return <GalleryUI type={'videoPlayButton'} size={60} />;
  } else if (type === '3d') {
    return <GalleryUI type={'rotateArrow'} size={60} />;
  } else {
    return <></>;
  }
};

export default function MediaItem<T extends Record<string, any>>(props: MediaProps<T>): JSX.Element {
  const {
    hasLink,
    options,
    imageDimensions,
    showPlayButton,
    MediaImplementation,
    enableImagePlaceholder,
    isVideoPlaceholder,
    videoPlaceholderUrl,
  } = props;
  const { behaviourParams_item_clickAction: clickAction, behaviourParams_item_video_playTrigger: playTrigger } =
    options;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, []);

  const isMediaPlayable = useMemo(() => {
    if (utils.isSSR()) {
      return false;
    }
    if (
      playTrigger === GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER ||
      playTrigger === GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO
    ) {
      return true;
    } else if (
      clickAction === GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING ||
      clickAction === GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].MAGNIFY
    ) {
      return true;
    } else if (clickAction === GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK && !hasLink) {
      return true;
    }
    return false;
  }, [hasLink, playTrigger, clickAction]);

  const createIframePlayer = () => (
    <IframeVideoPlayer dimensions={imageDimensions} url={isVideoPlaceholder ? videoPlaceholderUrl : props.videoUrl} />
  );

  const createThumbnail = (propsOverrides: any = {}) =>
    enableImagePlaceholder ? (
      <ImageItem
        {...props}
        imageDimensions={imageDimensions}
        id={props.idx}
        overlay={showPlayButton && !isMediaPlayable && getPlayButtonComponentByItemType(props.type)}
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
  if (!isMediaPlayable || props.isPrerenderMode || !isMounted) {
    return placeholder;
  }

  if (isEditMode()) {
    return (
      <>
        {thumbnail}
        {props.hover}
      </>
    );
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

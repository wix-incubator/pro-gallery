import React from 'react';
import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import ItemHover from '../itemHover';
import { IItemViewProps } from '../itemView';
import {
  getCustomInfoRendererProps,
  getLinkParams,
  getSlideAnimationStyles,
} from '../pure';
import VideoItemWrapper from '../videos/videoItemWrapper';
import TextItem from '../textItem.js';
import MagnifiedImage from '../imageWithMagnified.js';

interface ItemViewInnerProps extends IItemViewProps {
  shouldHover: boolean;
  itemWasHovered: boolean;
  hasLink: boolean;
  forceShowHover: boolean;
  thumbnailHighlightId: string;
  itemAnchor: React.LegacyRef<HTMLAnchorElement>;
  onLoad: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export function ITemViewInner(props: ItemViewInnerProps): JSX.Element {
  const { options, type, style, offset } = props;

  function getVideoItem(imageDimensions, itemHover) {
    return (
      <VideoItemWrapper
        {...props}
        shouldPlay={props.idx === props.playingVideoIdx}
        key={'video' + props.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        hasLink={props.hasLink}
        actions={{
          ...props.actions,
          setItemLoaded: props.onLoad,
          handleItemMouseDown: props.onMouseDown,
          handleItemMouseUp: props.onMouseUp,
        }}
      />
    );
  }

  function getItemHover(imageDimensions) {
    return (
      <ItemHover
        {...props}
        forceShowHover={props.forceShowHover}
        imageDimensions={imageDimensions}
        itemWasHovered={props.itemWasHovered}
        key="hover"
        actions={{
          handleItemMouseDown: props.onMouseDown,
          handleItemMouseUp: props.onMouseUp,
        }}
        renderCustomInfo={
          props.customComponents.customHoverRenderer
            ? () =>
                props.customComponents.customHoverRenderer &&
                props.customComponents.customHoverRenderer(
                  getCustomInfoRendererProps(props)
                )
            : null
        }
      ></ItemHover>
    );
  }

  function getTextItem(imageDimensions) {
    const textItemProps = utils.pick(props, [
      'id',
      'options',
      'style',
      'html',
      'cropRatio',
      'isPrerenderMode',
    ]);

    return (
      <TextItem
        {...textItemProps}
        key="textItem"
        imageDimensions={imageDimensions}
        actions={{
          handleItemMouseDown: props.onMouseDown,
          handleItemMouseUp: props.onMouseUp,
          setItemLoaded: props.onLoad,
        }}
      />
    );
  }

  function getImageItem(imageDimensions) {
    const imageProps = utils.pick(props, [
      'gotFirstScrollEvent',
      'calculatedAlt',
      'title',
      'description',
      'id',
      'idx',
      'options',
      'createUrl',
      'createMagnifiedUrl',
      'settings',
      'isPrerenderMode',
      'isTransparent',
      'style',
    ]);

    return (
      <MagnifiedImage
        {...imageProps}
        key="imageItem"
        imageDimensions={imageDimensions}
        isThumbnail={!!props.thumbnailHighlightId}
        actions={{
          handleItemMouseDown: props.onMouseDown,
          handleItemMouseUp: props.onMouseUp,
          setItemLoaded: props.onLoad,
        }}
      />
    );
  }

  function getSlideshowItemInner({
    options,
    width,
    height,
    itemInner,
    customComponents,
    photoId = undefined,
    id = undefined,
  }) {
    const { customSlideshowInfoRenderer } = customComponents;
    const slideAnimationStyles = getSlideAnimationStyles(props);
    const infoStyle = {
      height: `${options.slideshowInfoSize}px`,
      bottom: `-${options.slideshowInfoSize}px`,
      ...slideAnimationStyles,
      transition: 'none',
    };
    const slideshowInfo = customSlideshowInfoRenderer
      ? customSlideshowInfoRenderer(getCustomInfoRendererProps(props))
      : null;

    const { idx } = props;
    return (
      <div>
        <a
          ref={props.itemAnchor}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          {...getLinkParams(props)}
          tabIndex={-1}
          style={{ ...slideAnimationStyles, width, height }}
        >
          {itemInner}
        </a>
        <div
          className="gallery-slideshow-info"
          data-hook="gallery-slideshow-info-buttons"
          style={infoStyle}
        >
          {slideshowInfo}
        </div>
      </div>
    );
  }

  let itemInner;

  const { width, height, innerWidth, innerHeight } = style;
  const { innerTop, innerLeft } = offset;

  const itemStyles = {
    width: innerWidth,
    height: innerHeight,
    marginTop: innerTop,
    marginLeft: innerLeft,
  };
  let itemHover = <></>;
  const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(options);
  if (props.shouldHover || isSlideshow) {
    itemHover = getItemHover(itemStyles);
  }

  switch (type) {
    case 'dummy':
      itemInner = <div />;
      break;
    case 'video':
      itemInner = getVideoItem(itemStyles, itemHover);
      break;
    case 'text':
      itemInner = [getTextItem(itemStyles), itemHover];
      break;
    case 'image':
    case 'picture':
    default:
      if (props.isVideoPlaceholder) {
        itemInner = getVideoItem(itemStyles, itemHover);
      } else {
        itemInner = [getImageItem(itemStyles), itemHover];
      }
  }

  if (isSlideshow) {
    return getSlideshowItemInner({
      options,
      width,
      height,
      itemInner,
      customComponents: props.customComponents,
    });
  }

  return itemInner;
}

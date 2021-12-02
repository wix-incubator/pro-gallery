/* eslint-disable prettier/prettier */
import React from 'react';
import {
  GALLERY_CONSTS,
  GalleryProps,
  CustomComponents,
  GallerySettings,
} from 'pro-gallery-lib';
import { onAnchorFocus } from './itemHelper.js';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import {getLinkParams} from './pure'
import { useItemView } from './itemView/controller.js';
import { ITemViewInner } from './itemView/content.js';
import { ItemViewBottomInfo, ItemViewLeftInfo, ItemViewRightInfo, ItemViewTopInfo } from './itemView/info.js';


export interface IItemViewProps {
  idx: number;
  id: string;
  galleryId: string;
  html: string;
  photoId: string;
  hash: string;
  thumbnailHighlightId: string;
  playingVideoIdx: number;
  url: string;
  type: string;
  activeIndex: number;
  enableExperimentalFeatures: boolean;
  offset: {
    innerTop;
    innerLeft;
    left;
    top;
  };
  style: {
    width;
    height;
    innerWidth;
    innerHeight;
    infoWidth;
    infoHeight;
    bgColor;
  };
  isPrerenderMode: boolean;
  linkUrl: string;
  linkData: any;
  alt: string;
  isVideoPlaceholder: boolean;
  options: GalleryProps["options"];
  settings: GallerySettings;
  customComponents: CustomComponents;
  actions: {
    eventsListener: (name: string, ...data: any) => void;
  };
  directLink: { target: HTMLElement; url: string };
  container: HTMLElement;
}



function ItemView(props: IItemViewProps): JSX.Element {
  const {
    handleItemMouseUp,
    handleItemMouseDown,
    itemWasHovered,
    onItemInfoClick,
    onItemLoad,
    shouldHover,
    itemHasLink,
    getItemContainerClass,
    getItemWrapperClass,
    getItemWrapperStyles,
    getItemAriaRole,
    getItemContainerTabIndex,
    ariaLabel,
    onBlur,
    onContainerKeyDown,
    onFocus,
    onItemWrapperClick,
    onMouseOut,
    onMouseOver,
    itemAnchor,
    itemContainer,
    onContextMenu,
    getItemWrapperContainerStyle,
    getItemContainerStyles,
    simulateOverlayHover,
    onAnchorKeyDown,
  } = useItemView(props);
  
  const { photoId, id, hash, idx, options, type, url } = props;

    //if (there is an url for video items and image items) OR text item (text item do not use media url)
    const hasRequiredMediaUrl = !!url || type === 'text';
    //if titlePlacement !== SHOW_ON_HOVER and !this.hasRequiredMediaUrl, we will NOT render the itemWrapper (but will render the info element with the whole size of the item)
    const isItemWrapperEmpty =
      options.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
      !hasRequiredMediaUrl;
    const innerDiv = (
      <div
        className={getItemContainerClass()}
        onContextMenu={onContextMenu}
        id={cssScrollHelper.getSellectorDomId(props)}
        ref={itemContainer}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onFocus={onFocus}
        onBlur={onBlur} // The onblur event is the opposite of the onfocus event.
        onKeyDown={onContainerKeyDown}
        tabIndex={getItemContainerTabIndex()}
        aria-label={ariaLabel}
        data-hash={hash}
        data-id={photoId}
        data-idx={idx}
        role={getItemAriaRole()}
        data-hook="item-container"
        key={'item-container-' + id}
        style={getItemContainerStyles()}
      >
        <ItemViewTopInfo {...props} onClick={onItemInfoClick} hasRequiredMediaUrl={hasRequiredMediaUrl} />
        <ItemViewLeftInfo {...props} onClick={onItemInfoClick} hasRequiredMediaUrl={hasRequiredMediaUrl} />
        <div
          style={getItemWrapperContainerStyle()}
        >
          {!isItemWrapperEmpty && (
            <div
              data-hook="item-wrapper"
              className={getItemWrapperClass()}
              key={'item-wrapper-' + id}
              id={'item-wrapper-' + id}
              style={getItemWrapperStyles()}
              onClick={onItemWrapperClick}
            >
              <ITemViewInner
              {...props}
              forceShowHover={simulateOverlayHover()}
              hasLink={itemHasLink()}
              itemAnchor={itemAnchor}
              itemWasHovered={itemWasHovered}
              onLoad={onItemLoad}
              onMouseDown={handleItemMouseDown}
              onMouseUp={handleItemMouseUp}
              shouldHover={shouldHover()}
              />
            </div>
          )}
        </div>
        <ItemViewRightInfo {...props} onClick={onItemInfoClick} hasRequiredMediaUrl={hasRequiredMediaUrl} />
        <ItemViewBottomInfo {...props} onClick={onItemInfoClick} hasRequiredMediaUrl={hasRequiredMediaUrl} />
      </div>
    );
    const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(options)

    if (isSlideshow) {
      return innerDiv;
    } else {
      return (
        <a
          ref={itemAnchor}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          onFocus={() => {
            onAnchorFocus({
              itemAnchor: itemAnchor.current,
              enableExperimentalFeatures:
                props.enableExperimentalFeatures,
              itemContainer: itemContainer.current,
            });
          }}
          {...getLinkParams(props)}
          tabIndex={-1}
          onKeyDown={(e) => {
            /* Relvenat only for Screen-Reader case:
            Screen-Reader ignores the tabIdex={-1} and therefore stops and focuses on the <a> tag keyDown event,
            so it will not go deeper to the item-container keyDown event.
            */
            onAnchorKeyDown(e);
          }}
        >
          {innerDiv}
        </a>
      );
    }
}

export default ItemView;
/* eslint-enable prettier/prettier */

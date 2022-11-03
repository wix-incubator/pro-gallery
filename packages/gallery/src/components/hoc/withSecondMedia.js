import React from 'react';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

const withSecondaryMedia = (WrappedComponent) => {
  return (props) => {
    const {
      itemWasHovered,
      isCurrentHover,
      hasSecondaryMedia,
      secondaryMediaItem,
    } = props;
    if (
      props.options.behaviourParams.item.secondaryMedia.trigger ===
        GALLERY_CONSTS.secondaryMediaTrigger.OFF ||
      !hasSecondaryMedia
    ) {
      return <WrappedComponent {...props} />;
    }
    const getClasses = () => {
      return ['secondary-media-item', isCurrentHover ? 'show' : 'hide'].join(
        ' '
      );
    };
    const getSecondaryMediaItemProps = () => {
      const { createUrl, createMagnifiedUrl, style, html } = secondaryMediaItem;
      return {
        ...props,
        style,
        html,
        createUrl,
        createMagnifiedUrl,
      };
    };
    return (
      <div className="item-with-secondary-media-container">
        <WrappedComponent {...props} />
        <div className={getClasses()}>
          {itemWasHovered && (
            <WrappedComponent {...getSecondaryMediaItemProps()} />
          )}
        </div>
      </div>
    );
  };
};

export default withSecondaryMedia;

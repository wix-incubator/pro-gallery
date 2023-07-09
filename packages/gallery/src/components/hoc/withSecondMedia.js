import React from 'react';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

const withSecondaryMedia = (WrappedComponent) => {
  return (props) => {
    const { itemWasHovered, isCurrentHover, hasSecondaryMedia, secondaryMediaItem } = props;
    if (
      props.options[optionsMap.behaviourParams.item.secondaryMedia.trigger] ===
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger].OFF ||
      !hasSecondaryMedia
    ) {
      return <WrappedComponent {...props} />;
    }
    const getClasses = () => {
      return ['secondary-media-item', isCurrentHover ? 'show' : 'hide'].join(' ');
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
        <div className={getClasses()}>{itemWasHovered && <WrappedComponent {...getSecondaryMediaItemProps()} />}</div>
      </div>
    );
  };
};

export default withSecondaryMedia;

import React from 'react';
import utils from '../../common/utils/index.js';
import { GalleryComponent } from '../galleryComponent';
import { getHoverStyle } from './itemHoverStyleProvider';

export default class ItemHover extends GalleryComponent {
  getHoverClass() {
    const { styleParams, forceShowHover } = this.props;
    const hoverClass = ['gallery-item-hover'];

    if (
      styleParams.isSlider ||
      styleParams.isSlideshow ||
      styleParams.hasThumbnails
    ) {
      hoverClass.push(styleParams.galleryVerticalAlign);
    }

    hoverClass.push(
      'fullscreen-' + (styleParams.fullscreen ? 'enabled' : 'disabled'),
    );

    if (utils.isUndefined(styleParams.itemOpacity)) {
      //if gallery was just added to the page, and it's settings were never opened,
      //the styles of opacity and background were not set (are undefined),
      //so we are using the default background & opacity (is scss under .gallery-item-hover.default)
      hoverClass.push('default');
    }

    if (forceShowHover) {
      //in mobile, when item is hovered (tapped, with all the right configurations), forceShowHover is true
      hoverClass.push('force-hover');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }

    return hoverClass.join(' ');
  }

  render() {
    const {
      shouldHover,
      imageDimensions,
      actions,
      idx,
      styleParams,
    } = this.props;
    if (!shouldHover) {
      return null;
    }
    const hoverClass = this.getHoverClass();
    const { marginLeft, marginTop, width, height, ...restOfDimensions } =
      imageDimensions || {};
    //width and height will be taken from the gallery.scss and not be inline

    return (
      <div
        className={hoverClass}
        key={'item-hover-' + idx}
        data-hook={'item-hover-' + idx}
        aria-hidden={true}
        style={imageDimensions && imageDimensions.borderRadius ? {borderRadius: imageDimensions.borderRadius} : {}}
      >
        <div
          style={{
            ...restOfDimensions,
            ...getHoverStyle(styleParams),
          }}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
        >
          {this.props.render ? (
            <div className="gallery-item-hover-inner">
              {this.props.render(this.props)}
            </div>
          ) : (
            this.props.children
          )}
        </div>
      </div>
    );
  }
}

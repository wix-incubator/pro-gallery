import React from 'react';
import utils from '../../utils/index.js';
import _ from 'lodash';

export default class ItemHover extends React.Component {

  getHoverClass() {
    const {styleParams, forceShowHover, isMultisharing, itemType} = this.props;
    const hoverClass = itemType === 'video' ? ['gallery-item-hover-video'] : ['gallery-item-hover'];

    if (styleParams.isSlider || styleParams.isSlideshow || styleParams.hasThumbnails) {
      hoverClass.push(styleParams.galleryVerticalAlign);
    }

    hoverClass.push('fullscreen-' + (styleParams.fullscreen ? 'enabled' : 'disabled'));

    if (_.isUndefined(styleParams.itemOpacity)) {
      hoverClass.push('default');
    }

    // if (forceShowHover && utils.isEditor()) {
    if (forceShowHover) {
      hoverClass.push('hovered');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }

    if (isMultisharing) {
      hoverClass.push('hovered no-hover-bg');
    }
    return hoverClass.join(' ');
  }

  getMultishareHover() {
    const {isVideo, isMultishared} = this.props;
    return (<div className={'gallery-item-social' + (isVideo ? ' gradient-top' : '')}>
          <div className={`gallery-item-social-button gallery-item-social-multishare visible ${(utils.isMobile() ? 'mobile' : '')}`}>
            {!isMultishared ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <path className="gallery-item-svg-foreground"
                      d="M9,1A8,8,0,1,1,1,9,8,8,0,0,1,9,1M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <path className="gallery-item-svg-foreground"
                      d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0ZM8.59,13.46l-4-4,.71-.71,3.16,3.16,4.44-6.67.83.55Z"/>
                <polygon className="gallery-item-svg-background"
                         points="8.43 11.89 5.27 8.74 4.57 9.44 8.59 13.46 13.71 5.78 12.87 5.22 8.43 11.89"/>
              </svg>
            )}
          </div>
        </div>);
  }

  render() {
    const {shouldHover, isMultisharing, imageDimensions, actions, idx} = this.props;
    if (!shouldHover) {
      return null;
    }
    const hoverClass = this.getHoverClass();

    return (<div
        className={hoverClass}
        key={'item-hover-' + idx}
        data-hook={'item-hover-' + idx}
        style={imageDimensions}
        onClick={isMultisharing && actions.toggleMultishareSelection}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        >
        {isMultisharing ? this.getMultishareHover() : this.props.children}
      </div>);
  }
}

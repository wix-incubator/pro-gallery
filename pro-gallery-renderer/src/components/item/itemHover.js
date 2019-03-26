import React from 'react';
import utils from '../../utils/index.js';
import _ from 'lodash';

export default class ItemHover extends React.Component {

  getHoverClass() {
    const {styleParams, forceShowHover, itemType} = this.props;
    const hoverClass = itemType === 'video' ? ['gallery-item-hover-video'] : ['gallery-item-hover'];

    if (styleParams.isSlider || styleParams.isSlideshow || styleParams.hasThumbnails) {
      hoverClass.push(styleParams.galleryVerticalAlign);
    }

    hoverClass.push('fullscreen-' + (styleParams.fullscreen ? 'enabled' : 'disabled'));

    if (_.isUndefined(styleParams.itemOpacity)) {
      hoverClass.push('default');
    }

    if (forceShowHover) {
      //in mobile, when item is hovered (tapped, with all the right configurations), forceShowHover is true
      hoverClass.push('hovered');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }

    return hoverClass.join(' ');
  }

  render() {
    const {shouldHover, imageDimensions, actions, idx} = this.props;
    if (!shouldHover) {
      return null;
    }
    const hoverClass = this.getHoverClass();
    const {marginLeft, marginTop, width, height, ...restOfDimensions} = imageDimensions || {};
    //width and height will be taken from the gallery.scss and not be inline

    return (<div
        className={hoverClass}
        key={'item-hover-' + idx}
        data-hook={'item-hover-' + idx}
        style={restOfDimensions}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        >
          {this.props.render ? <div className="gallery-item-hover-inner">{this.props.render(this.props)}</div> : this.props.children}
        </div>);
  }
}

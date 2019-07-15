import React from 'react';
import utils from '../../../utils';
import EVENTS from '../../../utils/constants/events';
import { GalleryComponent } from '../../galleryComponent';

class LoveButton extends GalleryComponent {
  constructor(props) {
    super(props);
    this.toggleLove = this.toggleLove.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      loveButtonToggledToLove: undefined,
      animate: false,
    };
  }

  onKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        this.toggleLove(e);
        return false;
    }
  }

  toggleLove(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.actions.eventsListener(EVENTS.LOVE_BUTTON_CLICKED, this.props);
    this.setState({
      animate: !this.isLoved(),
      loveButtonToggledToLove: !this.isLoved(),
    });
  }

  containerClassName() {
    switch (this.props.layout) {
      case 'fullscreen':
        return 'fullscreen-social-love-container show-tooltip';
      default:
        return 'block-fullscreen gallery-item-social-love gallery-item-social-button show-tooltip';
    }
  }

  buttonClasssName() {
    const className = [];
    switch (this.props.layout) {
      case 'fullscreen':
        className.push('fullscreen-social-love');
        break;
      default:
        className.push('gallery-item-social-love');
        if (!utils.isStoreGallery()) {
          className.push('block-fullscreen');
        }
    }
    className.push(this.viewClassName());
    if (this.isLoved()) {
      className.push('progallery-svg-font-icons-love_full pro-gallery-loved');
    } else {
      className.push('progallery-svg-font-icons-love_empty');
    }
    if (this.state.animate) {
      className.push('love-animation');
    }
    return className.join(' ');
  }

  viewClassName() {
    switch (this.props.layout) {
      case 'fullscreen':
        return this.props.device === 'desktop' ? 'fullscreen-icon' : '';
      default:
        return '';
    }
  }

  counterClassName() {
    switch (this.props.layout) {
      case 'fullscreen':
        return (
          'fullscreen-social-love-count pro-fullscreen-shown ' +
          this.viewClassName()
        );
      default:
        return (
          'block-fullscreen gallery-item-social-love-count ' +
          this.viewClassName()
        );
    }
  }

  isLoved() {
    return typeof this.state.loveButtonToggledToLove === 'undefined'
      ? this.props.isLoved
      : this.state.loveButtonToggledToLove;
  }

  localLoveCount() {
    if (
      this.props.isLoved === true &&
      this.state.loveButtonToggledToLove === false
    ) {
      return -1;
    } else if (
      !this.props.isLoved &&
      this.state.loveButtonToggledToLove === true
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  createLoveCounter() {
    const count = (this.props.loveCount || 0) + this.localLoveCount();
    return !!this.props.showCounter && count > 0 ? (
      <i data-hook="love-counter" className={this.counterClassName()}>
        {count}
      </i>
    ) : null;
  }

  render() {
    const loveCounter = this.createLoveCounter();
    const clickAction = utils.isSite()
      ? utils.getMobileEnabledClick(this.toggleLove)
      : { onClick: e => e.stopPropagation() };
    const loveColor = this.isLoved() ? { color: 'red' } : {};

    return (
      <span
        data-hook="love-button"
        className={this.containerClassName()}
        {...clickAction}
        onKeyDown={this.onKeyPress}
        tabIndex={
          this.props.styleParams.isSlideshow &&
          this.props.currentIdx === this.props.idx
            ? 0
            : -1
        }
      >
        <button
          data-hook="love-icon"
          className={this.buttonClasssName()}
          role="checkbox"
          style={loveColor}
          tabIndex={-1}
        />
        {loveCounter}
      </span>
    );
  }
}

export default LoveButton;

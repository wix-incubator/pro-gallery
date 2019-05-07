import React from 'react';
import utils from '../../../utils';
import _ from 'lodash';
import window from '@wix/photography-client-lib/dist/src/sdk/windowWrapper';

class LoveButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLove = this.toggleLove.bind(this);
    this.updateLoveCount = this.updateLoveCount.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      isLoved: this.props.actions.itemActions.isLoved(props.itemId),
      loveCount: this.props.actions.itemActions.getLoveCount(props.itemId),
      animate: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const currIsLoved = this.props.actions.itemActions.isLoved(nextProps.itemId);
    const currLoveCount = this.props.actions.itemActions.getLoveCount(nextProps.itemId);
    if (nextProps.itemId !== this.props.itemId ||
        this.state.isLoved !== currIsLoved ||
        this.state.loveCount !== currLoveCount) {
      this.setState({
        isLoved: currIsLoved,
        loveCount: currLoveCount,
      });
    }
  }

  onKeyPress(e) {
    const callToggleLove = this.toggleLove;
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        callToggleLove(e);
        return false;
    }
  }

  toggleLove(e) {
    e.stopPropagation();
    e.preventDefault();
    const item = _.pick(this.props, ['layout', 'type', 'itemId', 'id', 'item', 'idx', 'hashtag']);
    Object.assign(item, {type: 'image'});
    this.props.actions.itemActions.postLoveActivity(item);
    this.props.actions.itemActions.toggleLove(item.itemId, item.layout);
    this.setState({
      animate: !this.state.isLoved,
      isLoved: !this.state.isLoved
    });
  }

  componentDidMount() {
    window.addEventListener('love_count_fetched', this.updateLoveCount);
  }

  componentWillUnmount() {
    window.removeEventListener('love_count_fetched', this.updateLoveCount);
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
        if (!(utils.isStoreGallery())) {
          className.push('block-fullscreen');
        }
    }
    className.push(this.viewClassName());
    if (this.state.isLoved) {
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
        return 'fullscreen-social-love-count pro-fullscreen-shown ' + this.viewClassName();
      default:
        return 'block-fullscreen gallery-item-social-love-count ' + this.viewClassName();
    }
  }

  createLoveCounter() {
    const count = this.state.loveCount + (this.state.isLoved ? 1 : 0);
    return !!this.props.showCounter && (count > 0) ? (
      <i
        data-hook="love-counter"
        className={this.counterClassName()}>{count}</i>) : null;
  }

  createMouseOver() {
    return e => {
      if (this.props.isSettings) {
        this.props.actions.itemActions.showTooltip(e, 'This option is not available in editor');
      }
    };
  }

  createMouseOut() {
    return () => {
      if (this.props.isSettings) {
        this.props.actions.itemActions.hideTooltip();
      }
    };
  }

  updateLoveCount() {
    this.setState({
      loveCount: this.props.actions.itemActions.getLoveCount(this.props.itemId)
    });
  }

  render() {
    const loveCounter = this.createLoveCounter();
    const clickAction = utils.getMobileEnabledClick(this.toggleLove);
    const loveColor = this.state.isLoved ? {color: 'red'} : {};

    return (
      <span
        data-hook="love-button"
        className={this.containerClassName()}
        onMouseOver = {this.createMouseOver()}
        onMouseOut = {this.createMouseOut()}
        {...clickAction}
        onKeyDown={this.onKeyPress}
        tabIndex={(this.props.styleParams.isSlideshow && this.props.currentIdx === this.props.idx) ? 0 : -1}
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

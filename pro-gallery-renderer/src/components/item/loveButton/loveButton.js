import React from 'react';
import utils from '../../../utils';
import {itemActions} from 'photography-client-lib/dist/src/item/itemActions';
import _ from 'lodash';
import styles from './loveButton.scss';

class LoveButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLove = this.toggleLove.bind(this);
    this.updateLoveCount = this.updateLoveCount.bind(this);

    this.state = {
      isLoved: itemActions.isLoved(props.itemId),
      loveCount: itemActions.getLoveCount(props.itemId),
      animate: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const currIsLoved = itemActions.isLoved(nextProps.itemId);
    const currLoveCount = itemActions.getLoveCount(nextProps.itemId);
    if (nextProps.itemId !== this.props.itemId ||
        this.state.isLoved !== currIsLoved ||
        this.state.loveCount !== currLoveCount) {
      this.setState({
        isLoved: currIsLoved,
        loveCount: currLoveCount,
      });
    }
  }

  toggleLove(e) {
    e.stopPropagation();
    e.preventDefault();
    const item = _.pick(this.props, ['layout', 'type', 'itemId', 'id', 'item', 'idx', 'hashtag']);
    Object.assign(item, {type: 'image'});
    itemActions.postLoveActivity(item);
    itemActions.toggleLove(item.itemId, item.layout);
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
      className.push('progallery-svg-font-icons-love_full');
      className.push(styles.loved);
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
        return 'fullscreen-social-love-count shown ' + this.viewClassName();
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
        itemActions.showTooltip(e, 'This option is not available in editor');
      }
    };
  }

  createMouseOut() {
    return () => {
      if (this.props.isSettings) {
        itemActions.hideTooltip();
      }
    };
  }

  updateLoveCount() {
    this.setState({
      loveCount: itemActions.getLoveCount(this.props.itemId)
    });
  }

  render() {
    const loveCounter = this.createLoveCounter();
    const clickAction = utils.getMobileEnabledClick(this.toggleLove);

    return (
        <span data-hook="love-button"
         className={this.containerClassName()}
         onMouseOver = {this.createMouseOver()}
         onMouseOut = {this.createMouseOut()}
         {...clickAction}
              >
          <button
          data-hook="love-icon"
          className={this.buttonClasssName()}
          role="checkbox"
          />
          {loveCounter}
        </span>
    );
  }
}

export default LoveButton;

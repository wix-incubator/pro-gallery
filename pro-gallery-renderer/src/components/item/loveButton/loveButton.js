import React from 'react';
import {utils} from '../../../utils';
import {itemActions} from 'photography-client-lib';

class LoveButton extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLove = this.toggleLove.bind(this);
    this.state = {
      animate: false
    };
  }

  toggleLove(e) {
    e.stopPropagation();
    this.props.toggleLove();
    this.setState({
      animate: (!this.props.isLoved)
    });
  }

  isLovedClassName() {
    return 'progallery-svg-font-icons-' + (this.props.isLoved ? 'love_full loved' : 'love_empty');
  }

  animatedClassName() {
    return (this.state.animate ? ' love-animation' : ' ');
  }

  containerClassName() {
    return (this.props.layout == 'fullscreen') ? 'fullscreen-social-love-container' : 'block-fullscreen gallery-item-social-love gallery-item-social-button';
  }

  buttonClassName() {
    return ((this.props.layout == 'fullscreen') ? 'fullscreen-social-love' : 'gallery-item-social-love') + (utils.isStoreGallery() ? (utils.isMobile ? ' mobile-social-icon' : '') : ((this.props.layout == 'fullscreen') ? '' : ' block-fullscreen'));
  }

  counterClassName() {
    return (this.props.layout == 'fullscreen') ? 'fullscreen-social-love-count shown' : 'block-fullscreen gallery-item-social-love-count';
  }

  render() {
    const {layout, device} = this.props;

    const loveButtonClassName = [this.buttonClassName(), itemActions.viewClassName(layout, device), this.isLovedClassName(), this.animatedClassName()].join(' ');
    const counterClassName = [this.counterClassName(), itemActions.viewClassName(layout, device)].join(' ');
    const loveCounter = this.props.showCounter && (this.props.count > 0) ? (
        <i
            data-hook="love-counter"
            style={this.props.counterStyle}
            className={counterClassName}>{this.props.count}</i>
    ) : '';

    const loveButton = <button
        data-hook="love-icon"
        className={loveButtonClassName}
        title={this.props.count}
        style={this.props.style}
        tabIndex={utils.getTabIndex(this.props.layout + 'Love')}
        aria-label={(this.props.isLoved ? 'Unlike' : 'Like') + `, ${this.props.count}`}
        aria-checked={(!!this.props.isLoved).toString()}
        role="checkbox"
    />;

    const clickAction = utils.getMobileEnabledClick(this.toggleLove);

    return (
        <span data-hook="love-button"
             className={this.containerClassName() + ' show-tooltip '}
             onMouseOver={e => {
if (this.props.isSettings) {
itemActions.showTooltip(e, 'This option is not available in editor')
;}
}}
             onMouseOut={() => {
if (this.props.isSettings) {
itemActions.hideTooltip();
}
}}
             {...clickAction}
          >
          {loveButton}
          {loveCounter}
        </span>
    );
  }
}

export default LoveButton;

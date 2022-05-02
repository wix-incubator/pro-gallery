import React from 'react';
import itemView from '../item/itemView.js';
import { getSlideAnimationStyles } from '../item/pure';

class GroupView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'GroupView';
    this.dom = [];
    this.state = {};
  }

  createDom(visible, empty) {
    return this.props.items.map((item) => {
      const props = item.renderProps({ ...this.props.galleryConfig, visible });
      return React.createElement(itemView, {
        ...props,
        type: empty ?? false ? 'dummy' : props.type,
      });
    });
  }

  shouldRender() {
    const { items } = this.props;
    if (!items || !items.length || !items[0]) {
      return false;
    }

    return true;
  }

  isVisible() {
    const { items, galleryConfig } = this.props;

    if (this.props.allowLoop) {
      const { idx } = items[items.length - 1];
      const { activeIndex, totalItemsCount } = galleryConfig;

      const distance = activeIndex - idx;
      const padding = Math.floor(totalItemsCount / 2);

      return Math.abs(distance) <= padding;
    }

    return true;
  }

  render() {
    const { activeIndex, slideAnimation } = this.props;
    const visible = this.props.items.some((item) => {
      return item.idx === activeIndex;
    });

    // const isBefore = this.props.items[0].idx < activeIndex
    // const isAfter = this.props.items[this.props.items.length - 1].idx > activeIndex
    const opacity = visible ? 1 : 0;
    console.log(`visible: ${visible}`);
    const { isRTL } = this.props.galleryConfig.options;
    const baseStyles = {
      opacity,
      '--group-top': this.props.top + 'px',
      '--group-left': isRTL ? 'auto' : this.props.left + 'px',
      '--group-width': this.props.width + 'px',
      '--group-right': !isRTL ? 'auto' : this.props.left + 'px',
    };

    const animationStyles = getSlideAnimationStyles({
      slideAnimation,
      isRTL,
      visible,
    });
    const style = {
      ...baseStyles,
      ...animationStyles,
    };
    return this.shouldRender() ? (
      <div
        key={`group_${this.props.idx}_${this.props.items[0].id}`}
        data-hook={'group-view'}
        style={style}
        aria-hidden={this.props.ariaHidden}
      >
        {this.createDom(this.isVisible(), this.props.shouldRenderEmpty)}
      </div>
    ) : null;
  }
}

export default GroupView;

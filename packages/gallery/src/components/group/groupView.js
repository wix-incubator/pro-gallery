import React from 'react';
import itemView from '../item/itemView.js';

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
    const { isRTL } = this.props.galleryConfig.options;
    return this.shouldRender() ? (
      <div
        key={`group_${this.props.idx}_${this.props.items[0].id}`}
        data-hook={'group-view'}
        style={{
          '--group-top': this.props.top + 'px',
          '--group-left': isRTL ? 'auto' : this.props.left + 'px',
          '--group-width': this.props.width + 'px',
          '--group-right': !isRTL ? 'auto' : this.props.left + 'px',
        }}
        aria-hidden={this.props.ariaHidden}
      >
        {this.createDom(this.isVisible(), this.props.shouldRenderEmpty)}
      </div>
    ) : null;
  }
}

export default GroupView;

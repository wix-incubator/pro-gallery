import React from 'react';
import ItemContainer from '../item/itemContainer.js';
import _ from 'lodash';
import utils from '../../utils';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';

class GroupView extends React.Component {

  constructor(props) {

    super(props);

    this.displayName = 'GroupView';
    this.dom = [];

    this.state = {

    };

    this.useRefactoredProGallery = utils.useRefactoredProGallery;

  }


  createDom(visible) {
    const dom = this.props.items.map(item => React.createElement(ItemContainer, _.merge(item.renderProps(_.merge(this.props.galleryConfig, {visible})), {store: this.props.store})));
    return dom;

  }

  render() {

    const visible = this.useRefactoredProGallery ? true : this.props.visible;
    const rendered = this.useRefactoredProGallery ? true : this.props.rendered;
    const groupStyle = {
      width: this.props.width,
      height: (this.props.totalHeight)
    };

    if (utils.useRelativePositioning) {

      return (
        <div
        className={' gallery-group gallery-group-' + (rendered ? (visible ? 'visible' : 'hidden') : 'none')}
        style={groupStyle}
        data-hook={'group-view'}
        key={`group_${this.props.idx}`}
        data-group-idx={this.props.idx}
        data-group-type={this.props.type}
        data-group-ratios={this.props.ratios}
        data-visible={(rendered ? (visible ? 'visible' : 'rendered') : 'hidden')}
        >
        {this.createDom(visible)}
      </div>
      );
    } else {
      return !!rendered && (
        <div
          key={`group_${this.props.idx}`}
          data-hook={'group-view'}
        >{this.createDom(visible)}</div>);
    }
  }
}

export default GroupView;

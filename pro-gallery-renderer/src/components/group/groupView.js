import React from 'react';
import ItemContainer from '../item/itemContainer.js';
import _ from 'lodash';

class GroupView extends React.Component {

  constructor(props) {

    super(props);

    this.displayName = 'GroupView';
    this.dom = [];
    //remove state?
    this.state = {};
  }

  render() {
    const {styleParams} = this.props.galleryConfig;
    this.dom = [];
    for (let item, i = 0; item = this.props.items[i]; i++) {
      this.dom.push(
          React.createElement(ItemContainer, _.merge(item.renderProps(_.merge(this.props.galleryConfig, {visible: this.props.visible, bottomInfoHeight: this.props.bottomInfoHeight})), {store: this.props.store}))
      );
    }

    return (
      <div
        className={' gallery-group gallery-group-' + (this.props.rendered ? (this.props.visible ? 'visible' : 'hidden') : 'none')}
        style={{width: this.props.width, height: (this.props.totalHeight)}}
        data-hook={'group-view'}
        key={`group_${this.props.idx}`}
        data-group-idx={this.props.idx}
        data-group-type={this.props.type}
        data-group-ratios={this.props.ratios}
      >
        {this.dom}
      </div>
    );
  }
}

/*
 idx: {this.props.idx} <br/>
 top: {this.props.top} <br/>
 {(this.props.rendered) ? 'Rendered' : 'Gone'} <br/>
 {(this.props.visible) ? 'Visible' : 'Hidden'} <br/>
 */

/*
 <img onLoad={() => this.setItemLoaded()} className={'image' + (this.state.loaded ? '' : '-preload')}
 src={this.props.resized_url}/>
 */

export default GroupView;

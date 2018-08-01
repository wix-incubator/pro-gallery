import React from 'react';
import ItemContainer from '../item/itemContainer.js';
import _ from 'lodash';
import utils from '../../utils';

class GroupView extends React.Component {

  constructor(props) {

    super(props);

    this.displayName = 'GroupView';
    this.dom = [];

    this.state = {
      visibleVertically: false,
      renderedVertically: false,
      visibleHorizontally: false,
      renderedHorizontally: false,
    };

    this.useRefactoredProGallery = !!(window && window.petri && window.petri['specs.pro-gallery.newGalleryContainer'] === 'true');

  }

  isRenderedVertically({target}) {
    const renderedPadding = utils.parseGetParam('renderedPadding') || target.clientHeight * 2;
    const isBelowViewportTop = target.offsetTop + this.props.bottom > target.scrollTop - renderedPadding;
    const isAboveViewportBottom = target.offsetTop + this.props.top < target.scrollTop + target.clientHeight + renderedPadding;
    const rendered = isBelowViewportTop && isAboveViewportBottom;
    return rendered;
  }

  isVisibleVertically({target}) {
    const visiblePadding = utils.parseGetParam('displayPadding') || target.clientHeight * 0.5;
    const isBelowViewportTop = target.offsetTop + this.props.bottom > target.scrollTop - visiblePadding;
    const isAboveViewportBottom = target.offsetTop + this.props.top < target.scrollTop + target.clientHeight + visiblePadding;
    const visible = isBelowViewportTop && isAboveViewportBottom;
    if (this.props.idx === 0) {
      console.log(`PROGALLERY [visibility] - Gallery #${target.offsetTop} Group #${this.props.idx} is vertically ${visible ? 'VISIBLE' : 'HIDDEN'}`, target);
    }
    return visible;
  }

  isVisibleHorizontally({target}) {
    if (!this.props.galleryConfig.styleParams.oneRow) {
      return true;
    }
    const visiblePadding = utils.parseGetParam('displayPadding') || target.clientWidth * 0.5;
    const isRightToViewportLeft = this.props.right > target.scrollLeft - visiblePadding;
    const isLeftToViewportRight = this.props.left < target.scrollLeft + target.clientWidth + visiblePadding;
    const visible = isRightToViewportLeft && isLeftToViewportRight;
    // console.log(`PROGALLERY [visibility] - Gallery #${target.offsetTop} Group #${this.props.idx} is horizontally ${visible ? 'VISIBLE' : 'HIDDEN'}`);
    return visible;
  }

  isRenderedHorizontally({target}) {
    if (!this.props.galleryConfig.styleParams.oneRow) {
      return true;
    }
    const renderedPadding = utils.parseGetParam('renderedPadding') || target.clientWidth * 2;
    const isRightToViewportLeft = this.props.right > target.scrollLeft - renderedPadding;
    const isLeftToViewportRight = this.props.left < target.scrollLeft + target.clientWidth + renderedPadding;
    const rendered = isRightToViewportLeft && isLeftToViewportRight;
    return rendered;
  }

  setVisibilityState(state) {
    const newState = {};
    Object.keys(state).forEach(key => {
      if (state[key] !== this.state[key]) {
        newState[key] = state[key];
      }
    });
    this.setState(newState);
  }

  setVerticalVisibility(params) {
    this.setVisibilityState({
      visibleVertically: this.isVisibleVertically(params),
      renderedVertically: this.isRenderedVertically(params)
    });
  }

  setHorizontalVisibility(params) {
    this.setVisibilityState({
      visibleHorizontally: this.isVisibleHorizontally(params),
      renderedHorizontally: this.isRenderedHorizontally(params)
    });
  }

  setInitialVisibility() {
    const {scrollBase, height, width, galleryHeight, galleryWidth} = this.props.galleryConfig.container;
    this.setVerticalVisibility({
      target: {
        scrollTop: 0,
        offsetTop: scrollBase,
        clientHeight: height || galleryHeight,
      }
    });
    this.setHorizontalVisibility({
      target: {
        scrollLeft: 0,
        clientWidth: width || galleryWidth,
      }
    });
  }

  initScrollListener() {
    this.onVerticalScroll = _.throttle(this.setVerticalVisibility.bind(this), 500);
    const {getScrollingElement} = this.props.galleryConfig.container;
    getScrollingElement.vertical().addEventListener('scroll', this.onVerticalScroll);
    const {oneRow} = this.props.galleryConfig.styleParams;
    if (oneRow) {
      this.onHorizontalScroll = _.throttle(this.setHorizontalVisibility.bind(this), 500);
      getScrollingElement.horizontal().addEventListener('scroll', this.onHorizontalScroll);
    }
  }

  removeScrollListener() {
    const {getScrollingElement} = this.props.galleryConfig.container;
    getScrollingElement.vertical().removeEventListener('scroll', this.onVerticalScroll);
    getScrollingElement.horizontal().removeEventListener('scroll', this.onHorizontalScroll);
  }

  componentDidMount() {
    if (this.useRefactoredProGallery) {
      this.initScrollListener();
      this.setInitialVisibility();
    }
  }

  componentWillUnmount() {
    if (this.useRefactoredProGallery) {
      this.removeScrollListener();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.useRefactoredProGallery) {
      if (this.props.galleryConfig.actions.getMoreItemsIfNeeded && this.state.visible) {
      //this group just got rendered - if it's the last, check if more items can be fetched from the db
        this.props.galleryConfig.actions.getMoreItemsIfNeeded(this.props.idx);
      }
    }
  }

  createDom(rendered, visible) {
    if (this.useRefactoredProGallery && !rendered) {
      return null;
    } else {
      const dom = [];
      for (let item, i = 0; item = this.props.items[i]; i++) {
        dom.push(
          React.createElement(ItemContainer, _.merge(item.renderProps(_.merge(this.props.galleryConfig, {visible, bottomInfoHeight: this.props.bottomInfoHeight})), {store: this.props.store}))
       );
      }
      return dom;
    }

  }

  render() {

    const visible = this.useRefactoredProGallery ? (this.state.visibleVertically && this.state.visibleHorizontally) : this.props.visible;
    const rendered = this.useRefactoredProGallery ? (this.state.renderedVertically && this.state.renderedHorizontally) : this.props.rendered;

    return (
      <div
        className={' gallery-group gallery-group-' + (rendered ? (visible ? 'visible' : 'hidden') : 'none')}
        style={{width: this.props.width, height: (this.props.totalHeight)}}
        data-hook={'group-view'}
        key={`group_${this.props.idx}`}
        data-group-idx={this.props.idx}
        data-group-type={this.props.type}
        data-group-ratios={this.props.ratios}
        data-visible={(rendered ? (visible ? 'visible' : 'rendered') : 'hidden')}
      >
      {!!this.useRefactoredProGallery && this.props.idx}
      {this.createDom(rendered, visible)}
      </div>
    );
  }
}

export default GroupView;

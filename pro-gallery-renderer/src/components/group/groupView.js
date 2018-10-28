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

    this.galleryScroll = {
      top: 0,
      left: 0
    };


    this.useRefactoredProGallery = !!(window && window.petri && window.petri['specs.pro-gallery.newGalleryContainer'] === 'true');

    this.screenSize = (window && window.screen) || {
      width: 1366,
      height: 768
    };

    this.renderedPaddingMultiply = 2;
    this.visiblePaddingMultiply = 0.5;

  }

  isRenderedVertically(target) {
    const renderedPadding = utils.parseGetParam('renderedPadding') || this.screenSize.height * this.renderedPaddingMultiply;
    const isBelowViewportTop = target.offsetTop + this.props.bottom > target.scrollTop - renderedPadding;
    const isAboveViewportBottom = target.offsetTop + this.props.top < target.scrollTop + this.screenSize.height + renderedPadding;
    const rendered = isBelowViewportTop && isAboveViewportBottom;
    return rendered;
  }

  isVisibleVertically(target) {
    const visiblePadding = utils.parseGetParam('displayPadding') || this.screenSize.height * this.visiblePaddingMultiply;
    const isBelowViewportTop = target.offsetTop + this.props.bottom > target.scrollTop - visiblePadding;
    const isAboveViewportBottom = target.offsetTop + this.props.top < target.scrollTop + this.screenSize.height + visiblePadding;
    const visible = isBelowViewportTop && isAboveViewportBottom;
    return visible;
  }

  isVisibleHorizontally(target) {
    if (!this.props.galleryConfig.styleParams.oneRow) {
      return true;
    }
    const visiblePadding = utils.parseGetParam('displayPadding') || this.screenSize.width * this.visiblePaddingMultiply;
    const isRightToViewportLeft = this.props.right > target.scrollLeft - visiblePadding;
    const isLeftToViewportRight = this.props.left < target.scrollLeft + this.screenSize.width + visiblePadding;
    const visible = isRightToViewportLeft && isLeftToViewportRight;
    return visible;
  }

  isRenderedHorizontally(target) {
    if (!this.props.galleryConfig.styleParams.oneRow) {
      return true;
    }
    const renderedPadding = utils.parseGetParam('renderedPadding') || this.screenSize.width * this.renderedPaddingMultiply;
    const isRightToViewportLeft = this.props.right > target.scrollLeft - renderedPadding;
    const isLeftToViewportRight = this.props.left < target.scrollLeft + this.screenSize.width + renderedPadding;
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

  setVerticalVisibility(target) {
    this.setVisibilityState({
      visibleVertically: this.isVisibleVertically(target),
      renderedVertically: this.isRenderedVertically(target)
    });
  }

  setHorizontalVisibility(target) {
    this.setVisibilityState({
      visibleHorizontally: this.isVisibleHorizontally(target),
      renderedHorizontally: this.isRenderedHorizontally(target)
    });
  }

  setInitialVisibility() {
    const {scrollBase, height, width, galleryHeight, galleryWidth} = this.props.galleryConfig.container;
    this.setVerticalVisibility({
      scrollTop: 0,
      offsetTop: scrollBase,
      clientHeight: height || galleryHeight,
    });
    this.setHorizontalVisibility({
      scrollLeft: 0,
      clientWidth: width || galleryWidth,
    });
  }

  componentDidMount() {
    if (this.useRefactoredProGallery) {
      this.setInitialVisibility();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.useRefactoredProGallery) {
      if (nextProps.galleryConfig.scroll.top !== this.galleryScroll.top) {
        this.setVerticalVisibility(nextProps.galleryConfig.scroll.vertical);
        this.galleryScroll.top = nextProps.galleryConfig.scroll.top;
      }
      if (nextProps.galleryConfig.scroll.left !== this.galleryScroll.left) {
        this.setHorizontalVisibility(nextProps.galleryConfig.scroll.horizontal);
        this.galleryScroll.left = nextProps.galleryConfig.scroll.left;
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.useRefactoredProGallery) {

      let hasJustBecomeVisible;
      if (this.props.galleryConfig.styleParams.oneRow) {
        hasJustBecomeVisible = this.state.visibleVertically && this.state.visibleHorizontally && !prevState.visibleHorizontally;
      } else {
        hasJustBecomeVisible = this.state.visibleVertically && !prevState.visibleVertically;
      }
      if (hasJustBecomeVisible) {
        console.log(`PROGALLERY [visibilities] - Group #${this.props.idx} JUST BECAME VISIBLE!`);
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

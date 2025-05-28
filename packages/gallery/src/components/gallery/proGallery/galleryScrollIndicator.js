import React from 'react';
import { utils, GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { cssScrollHelper } from '../../helpers/cssScrollHelper.js';

export default class ScrollIndicator extends React.Component {
  constructor(props) {
    super();

    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
    };
    this.debouncedOnScroll = utils.debounce(props.onScroll, 50);
  }

  removeScrollListener() {
    if (this.scrollEventListenerSet) {
      const scrollingElement = this.props.scrollingElement;
      try {
        scrollingElement.vertical().removeEventListener('scroll', this.onVerticalScroll);
      } catch (e) {
        //
      }

      try {
        const { scrollDirection } = this.props;
        if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
          scrollingElement.horizontal().removeEventListener('scroll', this.onHorizontalScroll);
        }
      } catch (e) {
        //
      }
      this.scrollEventListenerSet = false;
    }
  }

  initScrollListener() {
    if (this.scrollEventListenerSet) {
      this.removeScrollListener();
    }

    this.scrollEventListenerSet = true;
    const scrollingElement = this.props.scrollingElement;
    //Horizontal Scroll
    this.onHorizontalScrollTransition = ({ detail }) => {
      const step = Math.round(detail);
      if (step >= 0) {
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ) {
          this.setState({
            scrollLeft: this.state.scrollLeft + step,
          });
        }
      }
    };

    this.onHorizontalScroll = (e) => {
      this.props.setGotFirstScrollIfNeeded();
      const target = e.currentTarget || e.target || e;
      let left = target && (target.scrollX ?? target.scrollLeft ?? target.x);
      if (this.props.isRTL) {
        left = Math.abs(left); //this.props.totalWidth - left;
      }
      if (left >= 0) {
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ) {
          this.setState({
            scrollTop: left,
            scrollLeft: left,
          });
          this.props.getMoreItemsIfNeeded(left);
          this.debouncedOnScroll({ left });
        }
      }
    };

    if (
      this.props.galleryScrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
    ) {
      try {
        scrollingElement?.horizontal()?.addEventListener('scroll', this.onHorizontalScroll);
        scrollingElement?.horizontal()?.addEventListener('scrollTransition', this.onHorizontalScrollTransition);
      } catch (e) {
        console.error(e);
      }
    }
    //Vertical Scroll
    this.onVerticalScroll = (e) => {
      this.props.setGotFirstScrollIfNeeded();
      const target = e.currentTarget || e.target || e;
      const top = target && (target.scrollY || target.scrollTop || target.y);
      // console.log('[RTL SCROLL] onVerticalScroll: ', left);
      if (top >= 0) {
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL
        ) {
          this.setState({
            scrollTop: top,
          });
          this.props.getMoreItemsIfNeeded(top);
        }
        this.debouncedOnScroll({ top });
      }
    };
    try {
      scrollingElement.vertical().addEventListener('scroll', this.onVerticalScroll);
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  componentDidMount() {
    this.initScrollListener();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let didChange = false;
    for (const prop of ['id', 'scrollDirection', 'isRTL', 'totalWidth', 'scrollBase', 'scrollingElement']) {
      if (nextProps[prop] !== this.props[prop]) {
        didChange = true;
        break;
      }
    }

    if (didChange) {
      this.initScrollListener();
    }
  }

  render() {
    const verticalScrollBase =
      this.props.galleryScrollDirection ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL && this.props.scrollBase > 0
        ? this.props.scrollBase
        : 0;
    const scrollTopWithoutBase = this.state.scrollTop - verticalScrollBase;
    const { id } = this.props;
    return (
      <div
        key="css-scroll-indicator"
        data-hook="css-scroll-indicator"
        data-scroll-base={verticalScrollBase}
        data-scroll-top={this.state.scrollTop}
        className={cssScrollHelper.calcScrollClasses(id, scrollTopWithoutBase)}
        style={{ display: 'none' }}
      />
    );
  }
}

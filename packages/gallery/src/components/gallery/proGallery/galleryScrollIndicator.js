import React from 'react';
// import { utils } from 'pro-gallery-lib';
import { cssScrollHelper } from '../../helpers/cssScrollHelper';
import { GalleryComponent } from '../../galleryComponent';

export default class ScrollIndicator extends GalleryComponent {
  constructor(props) {
    super();

    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
    };
    // this.debouncedOnScroll = utils.debounce(props.onScroll, 50);
    this.debouncedOnScroll = props.onScroll;
  }

  removeScrollListener() {
    if (this.scrollEventListenerSet) {
      const scrollingElement = this.props.scrollingElement;
      try {
        scrollingElement
          .vertical()
          .removeEventListener('scroll', this.onVerticalScroll);
      } catch (e) {
        //
      }

      try {
        const { oneRow } = this.props;
        if (oneRow) {
          scrollingElement
            .horizontal()
            .removeEventListener('scroll', this.onHorizontalScroll);
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
    const { oneRow } = this.props;
    //Horizontal Scroll
    this.onHorizontalScrollTransition = ({ detail }) => {
      const step = Math.round(detail);
      if (step >= 0) {
        if (oneRow) {
          this.setState({
            scrollTop: this.state.scrollTop + step, //todo use both scrollTop and scrollLeft
            scrollLeft: this.state.scrollLeft + step,
          });
        }
      }
    };
    this.onHorizontalScroll = (e) => {
      this.props.setGotFirstScrollIfNeeded();
      const target = e.currentTarget || e.target || e;
      const top = target && (target.scrollY || target.scrollTop || target.y);
      let left = target && (target.scrollX || target.scrollLeft || target.x);
      if (this.props.isRTL) {
        left = Math.abs(left); //this.props.totalWidth - left;
      }
      // console.log('[RTL SCROLL] onHorizontalScroll: ', left);
      if (left >= 0) {
        if (this.props.oneRow) {
          this.setState({
            scrollTop: left, //todo use both scrollTop and scrollLeft
            scrollLeft: left,
          });
          this.props.getMoreItemsIfNeeded(left);
          this.debouncedOnScroll({ top, left });
        }
      }
    };

    try {
      scrollingElement
        .horizontal()
        .addEventListener('scroll', this.onHorizontalScroll);
      window.addEventListener(
        'scrollTransition',
        this.onHorizontalScrollTransition
      );
    } catch (e) {
      //
    }
    //Vertical Scroll
    this.onVerticalScroll = (e) => {
      this.props.setGotFirstScrollIfNeeded();
      const target = e.currentTarget || e.target || e;
      const top = target && (target.scrollY || target.scrollTop || target.y);
      let left = target && (target.scrollX || target.scrollLeft || target.x);
      if (this.props.isRTL) {
        left = this.props.totalWidth - left;
      }
      // console.log('[RTL SCROLL] onVerticalScroll: ', left);
      if (top >= 0) {
        if (!this.props.oneRow) {
          this.setState({
            scrollTop: top,
          });
          this.props.getMoreItemsIfNeeded(top);
          this.debouncedOnScroll({ top, left });
        }
      }
    };
    try {
      scrollingElement
        .vertical()
        .addEventListener('scroll', this.onVerticalScroll);
    } catch (e) {
      //
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
    for (const prop of [
      'domId',
      'oneRow',
      'isRTL',
      'totalWidth',
      'scrollBase',
    ]) {
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
      !this.props.oneRow && this.props.scrollBase > 0
        ? this.props.scrollBase
        : 0;
    const scrollTopWithoutBase = this.state.scrollTop - verticalScrollBase;
    const { domId } = this.props;
    return (
      <div
        key="css-scroll-indicator"
        data-hook="css-scroll-indicator"
        data-scroll-base={verticalScrollBase}
        data-scroll-top={this.state.scrollTop}
        className={cssScrollHelper.calcScrollClasses(
          scrollTopWithoutBase,
          domId
        )}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'white',
          zIndex: 99999,
          padding: 10,
          border: '1px solid blue',
        }}
      >
        {this.state.scrollTop}
      </div>
    );
  }
}

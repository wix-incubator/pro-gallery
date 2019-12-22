import React from 'react';
import utils from '../../../common/utils/index';
import { cssScrollHelper } from '../../helpers/cssScrollHelper';
import { GalleryComponent } from '../../galleryComponent';

export default class ScrollIndicator extends GalleryComponent {
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
    const { oneRow } = this.props;
    const scrollingElement = this.props.scrollingElement;
    //Horizontal Scroll
    this.onHorizontalScroll = e => {
      const target = e.currentTarget || e.target || e;
      const top = target && (target.scrollY || target.scrollTop || target.y);
      let left = target && (target.scrollX || target.scrollLeft || target.x);
      if (this.props.isRTL) {
        left = this.props.totalWidth - left;
      };
      // console.log('[RTL SCROLL] onHorizontalScroll: ', left);
      if (left >= 0) {
        if (oneRow) {
          this.setState({
            scrollTop: left, //todo use both scrollTop and scrollLeft
            scrollLeft: left,
          });
        }
        this.props.getMoreItemsIfNeeded(left);
        this.props.enableScrollPreload();
        this.debouncedOnScroll({ top, left });
      }
    };
    try {
      scrollingElement
        .horizontal()
        .addEventListener('scroll', this.onHorizontalScroll);
    } catch (e) {
      //
    }
    //Vertical Scroll
    this.onVerticalScroll = e => {
      const target = e.currentTarget || e.target || e;
      const top = target && (target.scrollY || target.scrollTop || target.y);
      let left = target && (target.scrollX || target.scrollLeft || target.x);
      if (this.props.isRTL) {
        left = this.props.totalWidth - left;
      };
      // console.log('[RTL SCROLL] onVerticalScroll: ', left);
      if (top >= 0) {
        if (!oneRow) {
          this.setState({
            scrollTop: top,
          });
        }
        this.props.getMoreItemsIfNeeded(top);
        this.props.enableScrollPreload();
        this.debouncedOnScroll({ top, left });
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

  componentWillReceiveProps() {
    this.initScrollListener();
  }

  render() {
    const verticalScrollBase =
      !this.props.oneRow && this.props.scrollBase > 0
        ? this.props.scrollBase
        : 0;
    const scrollTopWithoutBase = this.state.scrollTop - verticalScrollBase;
    const { galleryDomId } = this.props;
    return (
      <div
        key="css-scroll-indicator"
        data-hook="css-scroll-indicator"
        data-scroll-base={verticalScrollBase}
        data-scroll-top={this.state.scrollTop}
        className={cssScrollHelper.calcScrollClasses(
          galleryDomId,
          scrollTopWithoutBase,
        )}
        style={{ display: 'none' }}
      />
    );
  }
}

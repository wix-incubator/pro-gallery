import React from "react";
import { utils, GALLERY_CONSTS, optionsMap } from "pro-gallery-lib";
import { cssScrollHelper } from "../../helpers/cssScrollHelper";

export default class ScrollIndicator extends React.Component {
  constructor(props) {
    super();

    this.state = {
      scrolling: false,
      scrollTop: 0,
      scrollLeft: 0,
    };
    this.setState = this.setState.bind(this);
    this.debouncedOnScroll = props.onScroll;
  }

  removeScrollListener() {
    if (this.scrollEventListenerSet) {
      const scrollingElement = this.props.scrollingElement;
      try {
        scrollingElement.vertical().removeEventListener("scroll", this.onVerticalScroll);
      } catch (e) {
        //
      }

      try {
        const { scrollDirection } = this.props;
        if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
          scrollingElement.horizontal().removeEventListener("scroll", this.onHorizontalScroll);
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
    const { isRTL, setGotFirstScrollIfNeeded, scrollingElement } = this.props;

    this.pauseVerticalScrolling = utils.debounce(
      () =>
        this.setState({
          scrollingVerically: false,
        }),
      5000
    );
    this.pauseHorizontalScrolling = utils.debounce(
      () =>
        this.setState({
          scrollingHorizontally: false,
        }),
      5000
    );

    //Horizontal Scroll
    this.onHorizontalScrollTransition = ({ detail }) => {
      const step = Math.round(detail);
      if (step >= 0) {
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ) {
          this.setState({
            scrollingHorizontally: true,
            scrollLeft: this.state.scrollLeft + step,
          });
          this.pauseHorizontalScrolling();
        }
      }
    };
    this.onHorizontalScroll = (e) => {
      setGotFirstScrollIfNeeded();
      const target = e.currentTarget || e.target || e;
      let left = target && (target.scrollX || target.scrollLeft || target.x);
      if (isRTL) {
        left = Math.abs(left); //this.props.totalWidth - left;
      }
      const minScrollPosition = this.props.infiniteScrollAnimation ? 0 : this.state.scrollLeft;
      if (left >= minScrollPosition) {
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ) {
          this.setState({
            scrollingHorizontally: true,
            scrollLeft: Math.round(left),
          });
          this.pauseHorizontalScrolling();
          this.props.getMoreItemsIfNeeded(left);
          this.debouncedOnScroll({ left });
        }
      }
    };

    try {
      scrollingElement.horizontal()?.addEventListener("scroll", this.onHorizontalScroll);
    } catch (e) {
      console.error(e);
    }

    if (
      this.props.galleryScrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
    ) {
      try {
        scrollingElement.horizontal().addEventListener("scroll", this.onHorizontalScroll);

        scrollingElement.horizontal().addEventListener("scrollTransition", this.onHorizontalScrollTransition);
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
      const minScrollPosition = this.props.infiniteScrollAnimation ? 0 : this.state.scrollTop;
      if (top >= minScrollPosition) {
        this.setState({
          scrollingVerically: true,
          scrollTop: Math.round(top),
        });
        if (
          this.props.galleryScrollDirection ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL
        ) {
          this.setState({
            scrollTop: top,
          });
          this.props.getMoreItemsIfNeeded(top);
        }
        this.pauseVerticalScrolling();
        this.debouncedOnScroll({ top });
      }
    };
    try {
      scrollingElement.vertical().addEventListener("scroll", this.onVerticalScroll);
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
    for (const prop of ["id", "scrollDirection", "isRTL", "totalWidth", "scrollBase"]) {
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
    const scrollLeft = this.state.scrollLeft;
    const isScrollingVertically = this.state.scrollingVerically;
    const isScrollingHorizontally = this.state.scrollingHorizontally;
    const { id } = this.props;
    return (
      <div
        key="css-scroll-indicator"
        data-hook="css-scroll-indicator"
        data-scroll-base={verticalScrollBase}
        data-scroll-top={this.state.scrollTop}
        className={cssScrollHelper.calcScrollClasses(
          id,
          scrollTopWithoutBase,
          scrollLeft,
          isScrollingVertically,
          isScrollingHorizontally
        )}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          background: "white",
          zIndex: 99999,
          padding: 10,
          border: "1px solid blue",
        }}
      >
        x: {this.state.scrollLeft}
        <br />
        y: {this.state.scrollTop}
      </div>
    );
  }
}

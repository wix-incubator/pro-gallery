
import React from 'react';
import _ from 'lodash';
import {cssScrollHelper} from '../helpers/cssScrollHelper';

export default class CssScrollIndicator extends React.Component {

  constructor() {
    super();

    this.state = {
      scrollTop: 0,
      scrollLeft: 0
    };
  }

  toggleEventListeners(isInDisplay) {
    if (isInDisplay && !this.scrollEventListenerSet) {
      this.initScrollListener();
    } else {
      this.removeScrollListener(); //for guy to add the remove function
    }
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
        const {oneRow} = this.props;
        if (oneRow) {
          scrollingElement.horizontal().removeEventListener('scroll', this.onHorizontalScroll);
        }
      } catch (e) {
        //
      }
      this.scrollEventListenerSet = false;
    }
  }

  initScrollListener() {
    if (!this.scrollEventListenerSet) {
      this.scrollEventListenerSet = true;
      const scrollInterval = 500;

      const scrollingElement = this.props.scrollingElement;
      const {oneRow} = this.props;
      if (oneRow) {
            //Horizontal Scroll
        this.onHorizontalScroll = e => {
          const target = (e.currentTarget || e.target || e);
          const left = (target && (target.scrollX || target.scrollLeft || target.x));
          if (left >= 0) {
            this.setState({
              scrollTop: left, //todo use both scrollTop and scrollLeft
              scrollLeft: left
            });
            this.props.getMoreItemsIfNeeded(left);
          }
        };
        try {
          scrollingElement.horizontal().addEventListener('scroll', this.onHorizontalScroll);
        } catch (e) {
          //
        }
      } else {
            //Vertical Scroll
        // this.onVerticalScroll = _.throttle(e => {
        this.onVerticalScroll = e => {
          const target = (e.currentTarget || e.target || e);
          const top = (target && (target.scrollY || target.scrollTop || target.y));
          if (top >= 0) {
            this.setState({
              scrollTop: top
            });
            this.props.getMoreItemsIfNeeded(top);
          }
        };
        // }, scrollInterval);
        try {
          scrollingElement.vertical().addEventListener('scroll', this.onVerticalScroll);
        } catch (e) {
          //
        }
      }
    }
  }


  componentWillUnmount() {
    this.toggleEventListeners(false);
  }

  componentDidMount() {
    this.toggleEventListeners(true);
  }

  render() {
    return (
        <div data-hook="css-scroll-indicator" className={cssScrollHelper.calcScrollClasses(this.state.scrollTop, this.props.maxSize)}/>
    );

  }

}

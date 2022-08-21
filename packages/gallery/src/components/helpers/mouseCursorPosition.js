import * as React from 'react';
import { utils } from 'pro-gallery-lib';

function mouseFollower(listener) {
  let x = 0;
  let y = 0;
  let mouseIn = false;
  return {
    init(container) {
      const onMouseEnter = (e) => {
        if (!mouseIn) {
          mouseIn = true;
          x = e.pageX;
          y = e.pageY;
          listener(mouseIn, {
            x,
            y,
          });
          return true;
        }
        return false;
      };
      container.addEventListener('mousemove', (e) => {
        if (onMouseEnter(e)) {
          return;
        }
        x = e.pageX;
        y = e.pageY;
        if (mouseIn) {
          listener(mouseIn, {
            x,
            y,
          });
        }
      });
      container.addEventListener('mouseenter', (e) => {
        onMouseEnter(e);
      });
      container.addEventListener('mouseleave', () => {
        mouseIn = false;
        if (listener) {
          listener(mouseIn, {
            x,
            y,
          });
        }
      });
    },
  };
}

export class CursorController extends React.Component {
  state = {
    position: {
      x: 0,
      y: 0,
    },
    isMouseEnter: false,
  };
  containerRef = { current: null };
  setPosition = utils.throttle((position) => {
    this.setState({
      position,
    });
  }, 50);
  follower = mouseFollower((isMouseEnter, position) => {
    this.setState({ isMouseEnter }, () => {
      this.setPosition(position);
    });
  });
  componentDidMount() {
    this.follower.init(this.containerRef.current);
  }
  render() {
    const { children } = this.props;
    const { position, isMouseEnter } = this.state;
    return children({
      containerRef: this.containerRef,
      position,
      isMouseEnter,
    });
  }
}

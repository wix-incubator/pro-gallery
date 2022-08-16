import * as React from 'react';

const throttle = (func, time) => {
  let callback = null;
  let timer = null;
  return (...args) => {
    callback = () => func(...args);
    if (!timer) {
      callback();
      timer = setTimeout(() => {
        timer = null;
      }, time);
    }
  };
};

function mouseFollower(listener) {
  let x = 0;
  let y = 0;
  let mouseIn = false;
  return {
    init(container) {
      container.addEventListener('mousemove', (e) => {
        if (!mouseIn) {
          mouseIn = true;
          x = e.screenX;
          y = e.screenY;
          listener(mouseIn, {
            x,
            y,
          });

          return;
        }

        x += e.movementX;
        y += e.movementY;
        if (x > 0 && y > 0 && mouseIn) {
          listener(mouseIn, {
            x,
            y,
          });
        }
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
  setPosition = throttle((position) => {
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

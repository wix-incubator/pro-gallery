import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

const throttle = (func, time) => {
  let callback = null;
  let timer = null;
  return (...args) => {
    callback = () => func(...args);
    if (!timer) {
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, time);
    }
  };
};

function useCursor() {
  const [position, _setPosition] = useState({ x: 0, y: 0 });
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const containerRef = useRef();
  const mouseRef = useRef();
  const setPosition = React.useMemo(() => throttle(_setPosition, 50), []);

  useEffect(() => {
    let x = 0;
    let y = 0;
    let mouseIn = false;

    containerRef.current.addEventListener('mouseenter', (e) => {
      mouseIn = true;
      x = e.offsetX;
      y = e.offsetY;
      setIsMouseEnter(true);
      _setPosition({ x, y });
    });
    containerRef.current.addEventListener('mouseleave', () => {
      mouseIn = false;
      setIsMouseEnter(false);
    });
    containerRef.current.addEventListener('mousemove', (e) => {
      x += e.movementX;
      y += e.movementY;
      if (x > 0 && y > 0 && mouseIn) {
        setPosition({
          x,
          y,
        });
      }
    });
  }, []);

  console.log(position);
  return {
    containerRef,
    mouseRef,
    position,
    isMouseEnter,
  };
}

export function CursorController(props) {
  const cursor = useCursor();
  return props.children(cursor);
}

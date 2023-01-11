import { useEffect, useRef, useState } from 'react';

export function useTransition<T>(value: T, length = 200) {
  const [transitionValue, setTransitionValue] = useState(value);
  const [transitioning, setTransitioning] = useState(false);
  const timeout = useRef<any>();

  useEffect(() => {
    if (transitionValue !== value) {
      setTransitioning(true);
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setTransitioning(false);
        setTransitionValue(value);
      }, length);
    }
  }, [value]);

  return {
    transitioning,
    value: transitionValue,
  };
}

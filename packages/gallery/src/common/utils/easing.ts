export function easeInQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * (elapsed /= duration) * elapsed + initialValue;
}

export function easeOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
}

export function easeInOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}

export function easeInCubic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * (elapsed /= duration) * elapsed * elapsed + initialValue;
}

export function easeOutCubic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * ((elapsed = elapsed / duration - 1) * elapsed * elapsed + 1) + initialValue;
}

export function easeInOutCubic(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed * elapsed + initialValue;
  }
  return (amountOfChange / 2) * ((elapsed -= 2) * elapsed * elapsed + 2) + initialValue;
}

export function easeInQuart(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * (elapsed /= duration) * elapsed * elapsed * elapsed + initialValue;
}

export function easeOutQuart(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return -amountOfChange * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed - 1) + initialValue;
}

export function easeInOutQuart(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * ((elapsed -= 2) * elapsed * elapsed * elapsed - 2) + initialValue;
}

export function easeInQuint(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * (elapsed /= duration) * elapsed * elapsed * elapsed * elapsed + initialValue;
}

export function easeOutQuint(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return (
    amountOfChange * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed * elapsed + 1) + initialValue
  );
}

export function easeInOutQuint(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed * elapsed * elapsed * elapsed + initialValue;
  }
  return (amountOfChange / 2) * ((elapsed -= 2) * elapsed * elapsed * elapsed * elapsed + 2) + initialValue;
}

export function easeInSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return -amountOfChange * Math.cos((elapsed / duration) * (Math.PI / 2)) + amountOfChange + initialValue;
  return -amountOfChange * Math.cos((elapsed / duration) * (Math.PI / 2)) + amountOfChange + initialValue;
  //  return amountOfChange * (1 - Math.cos(x * (Math.PI / 2))) + initialValue;

  // x = (elapsed / duration)
  //1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * Math.sin((elapsed / duration) * (Math.PI / 2)) + initialValue;
}

export function easeInOutSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return (-amountOfChange / 2) * (Math.cos((Math.PI * elapsed) / duration) - 1) + initialValue;
}

export function easeInExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return elapsed === 0 ? initialValue : amountOfChange * Math.pow(2, 10 * (elapsed / duration - 1)) + initialValue;
}

export function easeOutExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return elapsed === duration
    ? initialValue + amountOfChange
    : amountOfChange * (-Math.pow(2, (-10 * elapsed) / duration) + 1) + initialValue;
}

export function easeInOutExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if (elapsed === 0) {
    return initialValue;
  }
  if (elapsed === duration) {
    return initialValue + amountOfChange;
  }
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * Math.pow(2, 10 * (elapsed - 1)) + initialValue;
  }
  return (amountOfChange / 2) * (-Math.pow(2, -10 * --elapsed) + 2) + initialValue;
}

export function easeInCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return -amountOfChange * (Math.sqrt(1 - (elapsed /= duration) * elapsed) - 1) + initialValue;
}

export function easeOutCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange * Math.sqrt(1 - (elapsed = elapsed / duration - 1) * elapsed) + initialValue;
}

export function easeInOutCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if ((elapsed /= duration / 2) < 1) {
    return (-amountOfChange / 2) * (Math.sqrt(1 - elapsed * elapsed) - 1) + initialValue;
  }
  return (amountOfChange / 2) * (Math.sqrt(1 - (elapsed -= 2) * elapsed) + 1) + initialValue;
}

export function easeInElastic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  let s = 1.70158;
  let p = 0;
  let a = amountOfChange;
  if (elapsed === 0) {
    return initialValue;
  }
  if ((elapsed /= duration) === 1) {
    return initialValue + amountOfChange;
  }
  if (!p) {
    p = duration * 0.3;
  }
  if (a < Math.abs(amountOfChange)) {
    a = amountOfChange;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(amountOfChange / a);
  }
  return (
    -(a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin(((elapsed * duration - s) * (2 * Math.PI)) / p)) + initialValue
  );
}

export function easeOutElastic(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  let s = 1.70158;
  let p = 0;
  let a = amountOfChange;
  if (elapsed === 0) {
    return initialValue;
  }
  if ((elapsed /= duration) === 1) {
    return initialValue + amountOfChange;
  }
  if (!p) {
    p = duration * 0.3;
  }
  if (a < Math.abs(amountOfChange)) {
    a = amountOfChange;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(amountOfChange / a);
  }
  return (
    a * Math.pow(2, -10 * elapsed) * Math.sin(((elapsed * duration - s) * (2 * Math.PI)) / p) +
    amountOfChange +
    initialValue
  );
}

export function easeInOutElastic(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  let s = 1.70158;
  let p = 0;
  let a = amountOfChange;
  if (elapsed === 0) {
    return initialValue;
  }
  if ((elapsed /= duration / 2) === 2) {
    return initialValue + amountOfChange;
  }
  if (!p) {
    p = duration * (0.3 * 1.5);
  }
  if (a < Math.abs(amountOfChange)) {
    a = amountOfChange;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(amountOfChange / a);
  }
  if (elapsed < 1) {
    return (
      -0.5 * (a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin(((elapsed * duration - s) * (2 * Math.PI)) / p)) +
      initialValue
    );
  }
  return (
    a * Math.pow(2, -10 * (elapsed -= 1)) * Math.sin(((elapsed * duration - s) * (2 * Math.PI)) / p) * 0.5 +
    amountOfChange +
    initialValue
  );
}

export function easeInBack(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
  s = 1.70158
): number {
  return amountOfChange * (elapsed /= duration) * elapsed * ((s + 1) * elapsed - s) + initialValue;
}

export function easeOutBack(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
  s = 1.70158
): number {
  return amountOfChange * ((elapsed = elapsed / duration - 1) * elapsed * ((s + 1) * elapsed + s) + 1) + initialValue;
}

export function easeInOutBack(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number,
  s = 1.70158
): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * (elapsed * elapsed * (((s *= 1.525) + 1) * elapsed - s)) + initialValue;
  }
  return (amountOfChange / 2) * ((elapsed -= 2) * elapsed * (((s *= 1.525) + 1) * elapsed + s) + 2) + initialValue;
}

export function easeInBounce(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return amountOfChange - easeOutBounce(duration - elapsed, 0, amountOfChange, duration) + initialValue;
}

export function easeOutBounce(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if ((elapsed /= duration) < 1 / 2.75) {
    return amountOfChange * (7.5625 * elapsed * elapsed) + initialValue;
  } else if (elapsed < 2 / 2.75) {
    return amountOfChange * (7.5625 * (elapsed -= 1.5 / 2.75) * elapsed + 0.75) + initialValue;
  } else if (elapsed < 2.5 / 2.75) {
    return amountOfChange * (7.5625 * (elapsed -= 2.25 / 2.75) * elapsed + 0.9375) + initialValue;
  } else {
    return amountOfChange * (7.5625 * (elapsed -= 2.625 / 2.75) * elapsed + 0.984375) + initialValue;
  }
}

export function easeInOutBounce(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  if (elapsed < duration / 2) {
    return easeInBounce(elapsed * 2, 0, amountOfChange, duration) * 0.5 + initialValue;
  }
  return easeOutBounce(elapsed * 2 - duration, 0, amountOfChange, duration) * 0.5 + amountOfChange * 0.5 + initialValue;
}

export function linear(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  return (amountOfChange * elapsed) / duration + initialValue;
  //const val = (elapsed / duration) * (amountOfChange) + initialValue;
  //const val = (_step) * (to - from) + from;
}

export const easingFunctions = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};

export const cssEasing = {
  easeInSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
  easeOutSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',
  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
  easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  easeInQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
  easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
  easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  easeInCirc: 'cubic-bezier(0.55, 0, 1, 0.45)',
  easeOutCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',
  easeInOutCirc: 'cubic-bezier(0.85, 0, 0.15, 1)',
  easeInBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  easeInElastic: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  easeOutElastic: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  easeInOutElastic: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  easeInBounce: 'cubic-bezier(0.71, 1.7, 0.735, 1.705)',
  easeOutBounce: 'cubic-bezier(0.3, -0.6, 0.335, -0.605)',
  easeInOutBounce: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
};

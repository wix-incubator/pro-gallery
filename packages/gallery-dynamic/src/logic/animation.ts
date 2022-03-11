import { IAnimationData, IAnimationSpring } from '../types/animations';
import { IColor, IItemCss } from '../types/css';
import _ from 'lodash';
import { sleep } from '../utils/time';
import { ItemProps } from '../types/item';
import { useEffect, useMemo, useState } from 'react';
import { useSettings } from './gallery';
import { IItemElement, IItemStyling } from '../types/gallery';
import { MotionStyle, Transition } from 'framer-motion';
import { TransformProperties } from 'framer-motion/types/motion/types';

export function styleMerger(...styles: IItemCss[]): IItemCss {
  return styles.reduce((acc, style) => {
    acc.backgroundColor = mergeColors(
      acc.backgroundColor,
      style.backgroundColor
    );
    acc.border = acc.border || {};
    acc.border.color = mergeColors(acc.border.color, style.border?.color);
    acc.border.width = avrage(acc.border.width, style.border?.width);
    acc.borderRadius = acc.borderRadius || {};
    acc.borderRadius.topLeft = avrage(
      acc.borderRadius.topLeft,
      style.borderRadius?.topLeft
    );
    acc.borderRadius.topRight = avrage(
      acc.borderRadius.topRight,
      style.borderRadius?.topRight
    );
    acc.borderRadius.bottomLeft = avrage(
      acc.borderRadius.bottomLeft,
      style.borderRadius?.bottomLeft
    );
    acc.borderRadius.bottomRight = avrage(
      acc.borderRadius.bottomRight,
      style.borderRadius?.bottomRight
    );
    acc.boxShadow = acc.boxShadow || {};
    acc.boxShadow.color = mergeColors(
      acc.boxShadow.color,
      style.boxShadow?.color
    );
    acc.boxShadow.offsetX = avrage(
      acc.boxShadow.offsetX,
      style.boxShadow?.offsetX
    );
    acc.boxShadow.offsetY = avrage(
      acc.boxShadow.offsetY,
      style.boxShadow?.offsetY
    );
    acc.boxShadow.blur = avrage(acc.boxShadow.blur, style.boxShadow?.blur);
    acc.boxShadow.spread = avrage(
      acc.boxShadow.spread,
      style.boxShadow?.spread
    );
    acc.filter = acc.filter || {};
    acc.filter.blur = avrage(acc.filter.blur, style.filter?.blur);
    acc.filter.brightness = avrage(
      acc.filter.brightness,
      style.filter?.brightness
    );
    acc.filter.contrast = avrage(acc.filter.contrast, style.filter?.contrast);
    acc.filter.grayscale = avrage(
      acc.filter.grayscale,
      style.filter?.grayscale
    );
    acc.filter.hueRotate = avrage(
      acc.filter.hueRotate,
      style.filter?.hueRotate
    );
    acc.filter.invert = avrage(acc.filter.invert, style.filter?.invert);
    acc.filter.opacity = avrage(acc.filter.opacity, style.filter?.opacity);
    acc.filter.saturate = avrage(acc.filter.saturate, style.filter?.saturate);
    acc.filter.sepia = avrage(acc.filter.sepia, style.filter?.sepia);
    acc.opacity = avrage(acc.opacity, style.opacity);
    acc.transform = acc.transform || {};
    for (const key in style.transform) {
      acc.transform[key] = avrage(acc.transform[key], style.transform[key]);
    }
    return acc;
  }, {} as IItemCss);
}

export function merge<T>(
  one: T | undefined,
  two: T | undefined
): (handler: (one: T, two: T) => T) => T | undefined {
  const defaultValue = one ?? two;
  if (one === undefined || two === undefined) {
    return () => defaultValue;
  }
  return (handler) => handler(one, two);
}

export function mergeColors(
  one: IColor | undefined,
  two: IColor | undefined
): IColor | undefined {
  return merge(
    one,
    two
  )((one, two) => {
    // avrage of two colors
    const r = (one.r + two.r) / 2;
    const g = (one.g + two.g) / 2;
    const b = (one.b + two.b) / 2;
    const a = (one.a + two.a) / 2;
    return { r, g, b, a };
  });
}

export function avrage(
  one: number | undefined,
  two: number | undefined
): number | undefined {
  return merge(one, two)((one, two) => (one + two) / 2);
}

export function animator() {
  const css: IItemCss[] = [];
  const cssUpdateListners: ((css: IItemCss) => void)[] = [];
  async function runAnimation(animation: IAnimationData) {
    let currentCss: IItemCss = {};
    const index = css.push(currentCss);
    for (const frame of animation.frames) {
      currentCss = frame.css;
      css[index - 1] = currentCss;
      const calcCss = styleMerger(...css);
      cssUpdateListners.forEach((listner) => listner(calcCss));
      await sleep(frame.duration);
    }
    if (!animation.keep) {
      css[index - 1] = {};
    }
  }
  function listen(listner: (css: IItemCss) => void) {
    cssUpdateListners.push(listner);
    const calcCss = styleMerger(...css);
    listner(calcCss);
    return () => {
      cssUpdateListners.splice(cssUpdateListners.indexOf(listner), 1);
    };
  }
  return {
    css,
    runAnimation,
    listen,
  };
}

export function useElementMotion(props: {
  distanceToViewport: number;
  elementStyling: IItemElement;
}) {
  const { distanceToViewport, elementStyling } = props;
  const { animations, spring } = elementStyling;
  const settings = useSettings();
  const [css, setCss] = useState<IItemCss>({});
  const animation = useMemo(() => animator(), []);
  useEffect(() => {
    return animation.listen(setCss);
  }, []);
  const shoudldLoad =
    distanceToViewport <
    settings.animationParams.loadAnimationDistanceFromViewport;
  useEffect(() => {
    animations.forEach((currentAnimation) => {
      if (currentAnimation.on === (shoudldLoad ? 'enter' : 'leave')) {
        animation.runAnimation(currentAnimation.data);
      }
    });
  }, [shoudldLoad]);

  return {
    css,
    spring: spring,
  };
}

const colorToCss = (color: IColor | undefined) =>
  color && `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

export function cssToMotion({
  css,
  spring,
}: {
  css: IItemCss;
  spring: Partial<IAnimationSpring>;
}): {
  style: MotionStyle;
  transform: TransformProperties;
  transition: Transition;
} {
  return {
    style: {
      border: `${css.border?.width}px solid ${colorToCss(css.border?.color)}`,
      borderTopRightRadius: css.borderRadius?.topRight,
      borderTopLeftRadius: css.borderRadius?.topLeft,
      borderBottomRightRadius: css.borderRadius?.bottomRight,
      borderBottomLeftRadius: css.borderRadius?.bottomLeft,
      boxShadow: `${css.boxShadow?.offsetX}px ${css.boxShadow?.offsetY}px ${
        css.boxShadow?.blur
      }px ${css.boxShadow?.spread}px ${colorToCss(css.boxShadow?.color)}`,
      backgroundColor: colorToCss(css.backgroundColor),
      opacity: css.opacity,
      filter: `blur(${css.filter?.blur || 0}px) brightness(${
        css.filter?.brightness || 0
      }%) contrast(${css.filter?.contrast || 0}%) grayscale(${
        css.filter?.grayscale || 0
      }%) hue-rotate(${css.filter?.hueRotate || 0}deg) invert(${
        css.filter?.invert || 0
      }%) opacity(${css.filter?.opacity || 0}%) saturate(${
        css.filter?.saturate || 0
      }%) sepia(${css.filter?.sepia || 0}%)`,
    },
    transform: css.transform || {},
    transition: {
      type: 'spring',
      mass: spring.mass,
      damping: spring.damping,
      velocity: spring.velocity,
      bounce: spring.bounce,
      stiffness: spring.stiffness,
    },
  };
}

export function useItemMotion(props: {
  styling: IItemStyling;
  distanceToViewport: number;
}) {
  const { styling, distanceToViewport } = props;
  const { elements } = styling;
  const { content, container } = elements;
  const contentMotion = cssToMotion(
    useElementMotion({
      distanceToViewport,
      elementStyling: content,
    })
  );
  const containerMotion = cssToMotion(
    useElementMotion({
      distanceToViewport,
      elementStyling: container,
    })
  );
  return {
    contentMotion,
    containerMotion,
  };
}

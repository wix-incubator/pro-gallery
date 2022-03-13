import { IAnimationData, IAnimationSpring } from '../types/animations';
import { IColor, IItemCss } from '../types/css';
import _ from 'lodash';
import { sleep } from '../utils/time';
import { useEffect, useMemo, useState } from 'react';
import { useGallery, useSettings } from './gallery';
import {
  AnimationMergeStrategy,
  IItemElement,
  IItemStyling,
} from '../types/gallery';
import { MotionStyle, Transition } from 'framer-motion';
import { TransformProperties } from 'framer-motion/types/motion/types';
import { ItemLocation, RelationToViewport } from '../types/item';

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

export function animator(animationMergeStrategy: AnimationMergeStrategy) {
  const css: IItemCss[] = [];
  const cssUpdateListners: ((css: IItemCss) => void)[] = [];
  async function update() {
    const calcCss =
      animationMergeStrategy === 'merge'
        ? styleMerger(...css)
        : css[css.length - 1];
    cssUpdateListners.forEach((listner) => listner(calcCss));
  }
  function runAnimation(animation: IAnimationData) {
    let canceled = false;
    const index = css.push({}) - 1;
    (async () => {
      for (const frame of animation.frames) {
        await sleep(frame.after);
        if (canceled) {
          break;
        }
        css[index] = frame.css;
        update();
      }
      if (!animation.keep) {
        css[index] = {};
        update();
      }
    })();
    return () => {
      css[index] = {};
      update();
      canceled = true;
    };
  }
  function listen(listner: (css: IItemCss) => void) {
    cssUpdateListners.push(listner);
    const calcCss =
      animationMergeStrategy === 'merge'
        ? styleMerger(...css)
        : css[css.length - 1];
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
  animationMergeStrategy: AnimationMergeStrategy;
  placement: RelationToViewport;
  isHover: boolean;
}) {
  const {
    distanceToViewport,
    elementStyling,
    animationMergeStrategy,
    isHover,
  } = props;
  const { animations, spring } = elementStyling;
  const settings = useSettings();
  const [css, setCss] = useState<IItemCss>({});
  const animation = useMemo(() => animator(animationMergeStrategy), []);
  useEffect(() => {
    return animation.listen(setCss);
  }, []);
  const shoudldLoad =
    distanceToViewport <
    settings.animationParams.loadAnimationDistanceFromViewport;
  useEffect(() => {
    const cancel = animations.map((currentAnimation) => {
      if (currentAnimation.on === 'enter' && shoudldLoad) {
        return animation.runAnimation(currentAnimation.data);
      }
      if (currentAnimation.on === 'leave' && !shoudldLoad) {
        return animation.runAnimation(currentAnimation.data);
      }
      return;
    });
    return () => {
      cancel.forEach((cancel) => cancel && cancel());
    };
  }, [shoudldLoad]);
  useEffect(() => {
    const cancel = animations.map((currentAnimation) => {
      if (currentAnimation.on === 'hover' && isHover) {
        return animation.runAnimation(currentAnimation.data);
      }
      return;
    });
    return () => {
      cancel.forEach((cancel) => cancel && cancel());
    };
  }, [isHover]);

  return {
    css: _.merge(
      {},
      elementStyling.intialStyle,
      shoudldLoad ? elementStyling.inViewStyle : {},
      css
    ),
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
      filter: `${
        css.filter?.blur ?? false ? `blur(${css.filter?.blur}px)` : ''
      } ${
        css.filter?.brightness ?? false
          ? `brightness(${css.filter?.brightness}%)`
          : ''
      } ${
        css.filter?.grayscale ?? false
          ? `grayscale(${css.filter?.grayscale}%)`
          : ''
      } ${
        css.filter?.hueRotate ?? false
          ? `hue-rotate(${css.filter?.hueRotate}deg)`
          : ''
      } ${
        css.filter?.invert ?? false ? `invert(${css.filter?.invert}%)` : ''
      } ${
        css.filter?.saturate ?? false
          ? `saturate(${css.filter?.saturate}%)`
          : ''
      } ${css.filter?.sepia ?? false ? `sepia(${css.filter?.sepia}%)` : ''}`,
      transform: `${
        css.transform?.translateX ?? false
          ? `translateX(${css.transform?.translateX}px)`
          : ''
      } ${
        css.transform?.translateY ?? false
          ? `translateY(${css.transform?.translateY}px)`
          : ''
      } ${
        css.transform?.translateZ ?? false
          ? `translateZ(${css.transform?.translateZ}px)`
          : ''
      } ${
        css.transform?.scale ?? false ? `scale(${css.transform?.scale})` : ''
      } ${
        css.transform?.scaleX ?? false ? `scaleX(${css.transform?.scaleX})` : ''
      } ${
        css.transform?.scaleY ?? false ? `scaleY(${css.transform?.scaleY})` : ''
      } ${
        css.transform?.rotate ?? false
          ? `rotate(${css.transform?.rotate}deg)`
          : ''
      } ${
        css.transform?.rotateX ?? false
          ? `rotateX(${css.transform?.rotateX}deg)`
          : ''
      } ${
        css.transform?.rotateY ?? false
          ? `rotateY(${css.transform?.rotateY}deg)`
          : ''
      } ${
        css.transform?.skewX ?? false ? `skewX(${css.transform?.skewX}deg)` : ''
      } ${
        css.transform?.skewY ?? false ? `skewY(${css.transform?.skewY}deg)` : ''
      } ${
        css.transform?.perspective ?? false
          ? `perspective(${css.transform?.perspective}px)`
          : ''
      }`,
    },
    transform: css.transform || {},
    transition: {
      type: 'spring',
      ...spring,
    },
  };
}

export function extendStyling(...styling: IItemStyling[]) {
  function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }

  return _.mergeWith(...styling, customizer) as IItemStyling;
}

export function useItemMotion(props: {
  itemStyling: IItemStyling;
  distanceToViewport: number;
  location: ItemLocation;
  placement: RelationToViewport;
  isHover: boolean;
}) {
  const { baseItemStyling } = useGallery();
  const { itemStyling, distanceToViewport, location, placement, isHover } =
    props;
  const styling = extendStyling(baseItemStyling, itemStyling);

  const { elements } = styling;
  const { content, container } = elements;
  const contentMotion = cssToMotion(
    useElementMotion({
      distanceToViewport,
      placement,
      elementStyling: content,
      animationMergeStrategy: styling.animationMergeStrategy,
      isHover,
    })
  );
  const containerMotion = cssToMotion(
    useElementMotion({
      distanceToViewport,
      placement,
      elementStyling: container,
      animationMergeStrategy: styling.animationMergeStrategy,
      isHover,
    })
  );
  containerMotion.style = {
    ...containerMotion.style,
    position: 'absolute',
    overflow: 'hidden',
    top: location.top,
    left: location.left,
    width: location.width,
    height: location.height,
  };
  contentMotion.style = {
    ...contentMotion.style,
    width: location.width,
    height: location.height,
  };

  return {
    contentMotion,
    containerMotion,
  };
}

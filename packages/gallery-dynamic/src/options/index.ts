import { StyleOptionController, StyleType } from '../types/options';

const make = <T extends StyleType>(option: StyleOptionController<T>) => option;

export const borderRadiusOption = make({
  type: StyleType.BORDER_RADIUS,
  onChange: (value, style) => ({
    ...style,
    borderRadius: value,
  }),
  getValue: (css) => {
    return css.borderRadius;
  },
});

export const locationOption = make({
  type: StyleType.LOCATION,
  onChange: (value, style) => ({
    ...style,
    transform: {
      ...style.transform,
      translateX: value.left,
      translateY: value.top,
    },
  }),
  getValue: (css) => {
    return {
      left: css.transform?.translateX ?? 0,
      top: css.transform?.translateY ?? 0,
    };
  },
});

export const scaleOption = make({
  type: StyleType.NUMBER,
  onChange: '.transform.scale',
  getValue: (css) => {
    return css.transform?.scale ?? 1;
  },
});

export const rotationOption = make({
  type: StyleType.ROTATION,
  onChange: '.transform.rotate',
  getValue: (css) => {
    return css.transform?.rotate ?? 0;
  },
});

export const blurOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.blur',
  getValue: (css) => {
    return css.filter?.blur ?? 0;
  },
  metaData: {
    min: 0,
    max: 50,
  },
});

export const brightnessOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.brightness',
  getValue: (css) => {
    return css.filter?.brightness ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const contrastOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.contrast',
  getValue: (css) => {
    return css.filter?.contrast ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const grayscaleOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.grayscale',
  getValue: (css) => {
    return css.filter?.grayscale ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const hueRotateOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.hueRotate',
  getValue: (css) => {
    return css.filter?.hueRotate ?? 0;
  },
  metaData: {
    min: 0,
    max: 360,
  },
});

export const invertOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.invert',
  getValue: (css) => {
    return css.filter?.invert ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const opacityOption = make({
  type: StyleType.NUMBER,
  onChange: '.opacity',
  getValue: (css) => {
    return css.opacity ?? 1;
  },
  metaData: {
    min: 0,
    max: 1,
  },
});

export const saturateOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.saturate',
  getValue: (css) => {
    return css.filter?.saturate ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const sepiaOption = make({
  type: StyleType.NUMBER,
  onChange: '.filter.sepia',
  getValue: (css) => {
    return css.filter?.sepia ?? 1;
  },
  metaData: {
    min: 0,
    max: 100,
  },
});

export const borderWidthOption = make({
  type: StyleType.NUMBER,
  onChange: '.border.width',
  getValue: (css) => {
    return css.border?.width ?? 0;
  },
  metaData: {
    min: 0,
    max: 20,
  },
});

export const borderColorOption = make({
  type: StyleType.COLOR,
  getValue: (css) => {
    return css.border?.color;
  },
  onChange: (value, style) => ({
    ...style,
    border: {
      ...style.border,
      color: value,
    },
  }),
});

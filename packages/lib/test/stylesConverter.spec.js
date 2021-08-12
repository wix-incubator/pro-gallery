import { expect } from 'chai';
import {
  convertStyles,
  convertStylesBackwards,
} from '../src/core/helpers/stylesConverter';

describe('stylesConverter', () => {
  it('should create new styles from old ones', () => {
    const expected = { ...oldStyles(), ...newStyles() };
    const converted = convertStyles(oldStyles());
    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
  it('should create old styles from new ones while keeping existing ones', () => {
    const expected = {
      ...oldStyles(),
      ...newStyles(),
      someUnrelatedOldStyle: 0,
    };
    const converted = convertStylesBackwards({
      ...newStyles(),
      someUnrelatedOldStyle: 0,
    });
    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
});

function oldStyles() {
  return {
    cubeRatio: 0.5,
    isVertical: false,
  };
}
function newStyles() {
  return {
    layoutParams_cropRatio: 0.5,
    layoutParams_isVerticalOrientation: false,
  };
}

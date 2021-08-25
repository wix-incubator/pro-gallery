import { expect } from 'chai';
import {
  convertOptions,
  layoutParamsMap,
  convertOptionsBackwards,
} from '../src/core/helpers/stylesConverter';

describe('stylesConverter', () => {
  it('should contain correct keys for params map', () => {
    expect(layoutParamsMap.collageAmount).to.equal(
      'layoutParams_collage_amount'
    );
    expect(layoutParamsMap.arrowsVerticalPosition).to.equal(
      'layoutParams_navigationArrows_verticalAlignment'
    );
  });
  it('should create new styles from old ones', () => {
    const expected = { ...oldStyles(), ...newStyles() };
    const converted = convertOptions(oldStyles());

    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
  it('should create old styles from new ones while keeping existing ones', () => {
    const expected = {
      ...oldStyles(),
      ...newStyles(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      someUnrelatedOldStyle: 0,
    };
    const converted = convertOptionsBackwards({
      ...newStyles(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
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

import { expect } from 'chai';
import {
  convertOptions,
  layoutParamsMap,
  convertOptionsBackwards,
} from '../src/core/helpers/optionsConverter';

describe('optionsConverter', () => {
  it('should contain correct keys for params map', () => {
    expect(layoutParamsMap.collageAmount).to.equal(
      'layoutParams_collage_amount'
    );
    expect(layoutParamsMap.arrowsVerticalPosition).to.equal(
      'layoutParams_navigationArrows_verticalAlignment'
    );
  });
  it('should create new options from old ones', () => {
    const expected = { ...oldOptions(), ...newOptions() };
    const converted = convertOptions(oldOptions());

    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
  it('should create old options from new ones while keeping existing ones', () => {
    const expected = {
      ...oldOptions(),
      ...newOptions(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      someUnrelatedOldOption: 0,
    };
    const converted = convertOptionsBackwards({
      ...newOptions(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      someUnrelatedOldOption: 0,
    });

    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
});

function oldOptions() {
  return {
    cubeRatio: 0.5,
    isVertical: false,
  };
}
function newOptions() {
  return {
    layoutParams_cropRatio: 0.5,
    layoutParams_isVerticalOrientation: false,
  };
}

import { expect } from 'chai';
import {
  flattenObject,
  flatToNested,
  mergeNestedObjects,
  mutatingAssignMultipleByStrings,
} from '../src/core/helpers/optionsUtils';

describe('optionsUtils', () => {
  it('should create a nested object out of a flat object', () => {
    expect(nested()).to.deep.equal(flatToNested(flat()));
  });
  it('should flattenObjects', () => {
    let expected = flat();
    delete expected.itemShadowOpacityAndColor; // we are not expecting this to be on the object as the nested object has this as a deep object
    expect(expected).to.deep.equal(flattenObject(nested()));
  });
  it('should merge objects properly', () => {
    let expected = merged();
    let actual = mergeNestedObjects(nested(), nested2());
    expect(actual).to.deep.equal(expected);
  });
  it('should assign multiple strings into the same object', () => {
    let initial = {
      layoutParams: {
        bar: 'foo',
      },
    };
    let expected = {
      hi: 'bye',
      layoutParams: {
        bar: 'foo',
        alice: 'bob',
        moshe: 'bob',
      },
    };
    mutatingAssignMultipleByStrings(initial, [
      ['layoutParams_alice', 'bob'],
      ['layoutParams_moshe', 'bob'],
      ['hi', 'bye'],
    ]);
    expect(initial).to.deep.equal(expected);
  });
});

function flat() {
  return {
    sharpParams_quality: 90,
    sharpParams_usm: {},
    itemShadowOpacityAndColor: 'color-5', //this should not be kept when building a nested out of this as the next line will delete it.
    itemShadowOpacityAndColor_themeName: 'color_15',
    itemShadowOpacityAndColor_value: 'rgba(0,0,0,0.2)',
  };
}
function nested() {
  return {
    sharpParams: { quality: 90, usm: {} },
    itemShadowOpacityAndColor: {
      themeName: 'color_15',
      value: 'rgba(0,0,0,0.2)',
    },
    // itemShadowOpacityAndColor: 'color-5',
  };
  // return { sharpParams: { quality: 90, usm: {} } };
}
function nested2() {
  return {
    sharpParams: { quality: 80 },
  };
}

function merged() {
  return {
    sharpParams: { quality: 80, usm: {} },
    itemShadowOpacityAndColor: {
      themeName: 'color_15',
      value: 'rgba(0,0,0,0.2)',
    },
  };
}

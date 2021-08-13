import { expect } from 'chai';
import { flattenObject, flatToNested } from '../src/core/helpers/stylesUtils';

describe('stylesConverter', () => {
  it('should create a nested object out of a flat object', () => {
    expect(nested()).to.deep.equal(flatToNested(nested()));
  });
  it('should flattenObjects', () => {
    expect(flat()).to.deep.equal(flattenObject(nested()));
  });
});

function flat() {
  return { sharpParams_quality: 90, sharpParams_usm: {} };
}
function nested() {
  return { sharpParams: { quality: 90, usm: {} } };
}

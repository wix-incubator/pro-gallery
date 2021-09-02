import { expect } from 'chai';
import utils from '../src/common/utils/index';

describe('utils isMeaningfulString', () => {
  it('should return false if is not a meaningful string', () => {
    expect([undefined, '', '  '].some(utils.isMeaningfulString)).to.equal(
      false
    );
  });
  it('should return true if is a meaningful string', () => {
    expect(['yakov', ' yakov h  '].some(utils.isMeaningfulString)).to.equal(
      true
    );
  });
});

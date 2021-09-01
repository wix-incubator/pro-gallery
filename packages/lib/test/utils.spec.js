import { expect } from 'chai';
import utils from '../src/common/utils/index';

describe('utils isMeaningfulString', () => {
  it('should return false if is not a meaningful string', () => {
    [undefined, '', '  '].map((value) => {
      expect(utils.isMeaningfulString(value)).to.equal(false);
    });
  });
  it('should return true if is a meaningful string', () => {
    ['yakov', ' yakov h  '].map((value) => {
      expect(utils.isMeaningfulString(value)).to.equal(true);
    });
  });
});

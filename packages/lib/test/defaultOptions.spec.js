import { expect } from 'chai';
import { optionsMap } from '../dist/esm-types';
import { populateWithDefaultOptions } from '../src/common/defaultOptions';

describe('defaultOptions', () => {
  it('should populate missing properties with default properties and should leave defined properties as they are', () => {
    let customOptions = {
      [optionsMap.layoutParams.structure.galleryLayout]: 5,
    };
    let populated = populateWithDefaultOptions(customOptions);
    expect(populated[optionsMap.layoutParams.structure.galleryLayout]).to.eql(
      5
    ); //this should be 5 and not the default (-1)
    expect(populated[optionsMap.layoutParams.info.height]).to.eql(200);
  });
});

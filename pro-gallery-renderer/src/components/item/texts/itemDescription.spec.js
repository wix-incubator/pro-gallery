'use strict';

import ItemDescription from './itemDescription';
import {shallow, mount} from 'enzyme';
import React from 'react';
import {expect} from 'chai';

describe('Item Description', () => {
  it('should show description text', () => {
    const descriptionText = 'Hello';
    const wrapper = mount(<ItemDescription description={descriptionText} />);
    expect(wrapper.find({'data-hook': 'item-description'}).text()).to.equal(descriptionText);
  });
});

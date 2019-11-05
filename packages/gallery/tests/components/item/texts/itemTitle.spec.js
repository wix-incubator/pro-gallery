// import ItemTitle from '../../../../src/components/item/texts/itemTitle.js';
import ItemTitle from '../../../../src/components/item/texts/itemTitle';

import { configure, mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Item Title', () => {
  it('should show title text', () => {
    const titleText = 'Hello';
    const wrapper = mount(<ItemTitle title={titleText} />);
    expect(wrapper.find({ 'data-hook': 'item-title' }).text()).to.equal(
      titleText,
    );
  });
});

import ItemDescription from '../../../../src/components/item/texts/itemDescription';
import { configure, mount } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('Item Description', () => {
  it('should show description text', () => {
    const descriptionText = 'Hello';
    const wrapper = mount(<ItemDescription description={descriptionText} />);
    expect(wrapper.find({ 'data-hook': 'item-description' }).text()).to.equal(
      descriptionText,
    );
  });
});

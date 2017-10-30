'use strict';

import LoveButton from './loveButton.js';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { utils } from '../../../utils/utils'


describe('Love Button', () => {
  describe('Gallery', () => {

    it('should dispaly love properly', () => {
      let wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-icon'}).length).toBe(1);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(1);
    });

    it('should hide counter when empty', () => {
      let wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={0}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(0);
    });

    it('shouldn\'t show counter if we say so', () => {
      let wrapper = shallow(<LoveButton showCounter={false} isLoved={true} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(0);
    });


    // it('should have right class', () => {
    //   let wrapper = shallow(<LoveButton showCounter="true"/>);
    //   expect(wrapper.find('i').hasClass('block-fullscreen')).toBe(true);
    // });

    it('should toggle love', () => {
      let toggleLove = jasmine.createSpy('toggleLove');
      let itemId = utils.getUUID();
      let wrapper = mount(<LoveButton showCounter={true} isLoved={false} count={0} toggleLove={toggleLove}/>);
      wrapper.find({'data-hook': 'love-button'}).simulate('click');
      expect(toggleLove).toHaveBeenCalledWith();
    });

  });

});




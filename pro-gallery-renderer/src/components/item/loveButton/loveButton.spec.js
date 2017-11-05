'use strict';

import LoveButton from './loveButton.js';
import {shallow, mount} from 'enzyme';
import React from 'react';
import utils from '../../../utils';


describe('Love Button', () => {
  describe('Gallery', () => {

    it('should dispaly love properly', () => {
      const wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-icon'}).length).toBe(1);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(1);
    });

    it('should hide counter when empty', () => {
      const wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={0}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(0);
    });

    it('shouldn\'t show counter if we say so', () => {
      const wrapper = shallow(<LoveButton showCounter={false} isLoved={true} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).toBe(0);
    });


    // it('should have right class', () => {
    //   let wrapper = shallow(<LoveButton showCounter="true"/>);
    //   expect(wrapper.find('i').hasClass('block-fullscreen')).toBe(true);
    // });

    it('should toggle love', () => {
      const toggleLove = jasmine.createSpy('toggleLove');
      const wrapper = mount(<LoveButton showCounter={true} isLoved={false} count={0} toggleLove={toggleLove}/>);
      wrapper.find({'data-hook': 'love-button'}).simulate('click');
      expect(toggleLove).toHaveBeenCalledWith();
    });

  });

});




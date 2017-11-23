'use strict';

import LoveButton from './loveButton.js';
import {shallow, mount} from 'enzyme';
import React from 'react';
import utils from '../../../utils';
import {use, spy, expect} from 'chai';
import spies from 'chai-spies';

use(spies);

describe('Love Button', () => {
  describe('Gallery', () => {

    it('should dispaly love properly', () => {
      const wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-icon'}).length).to.equal(1);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).to.equal(1);
    });

    it('should hide counter when empty', () => {
      const wrapper = shallow(<LoveButton showCounter={true} isLoved={false} count={0}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).to.equal(0);
    });

    it('shouldn\'t show counter if we say so', () => {
      const wrapper = shallow(<LoveButton showCounter={false} isLoved={true} count={5}/>);
      expect(wrapper.find({'data-hook': 'love-counter'}).length).to.equal(0);
    });


    // it('should have right class', () => {
    //   let wrapper = shallow(<LoveButton showCounter="true"/>);
    //   expect(wrapper.find('i').hasClass('block-fullscreen')).to.equal(true);
    // });

    it('should toggle love', () => {
      const toggleLove = spy('toggleLove');
      const wrapper = mount(<LoveButton showCounter={true} isLoved={false} count={0} toggleLove={toggleLove}/>);
      wrapper.find({'data-hook': 'love-button'}).simulate('click');
      expect(toggleLove).to.have.been.called();
    });

  });

});

'use strict';

import CustomButton from './customButton.js';
import React from 'react';
import {use, spy, expect} from 'chai';
import spies from 'chai-spies';
import sinon from 'sinon';
import utils from '../../../utils';
import GalleryDriver from '../../../../test/drivers/reactDriver.js';
import {testImages} from '../../../../test/images-mock.js';

use(spies);

describe('Custom Button', () => {

  let driver;
  let sampleItemViewProps;
  let sampleItem;
  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps.styleParams, {
      galleryVerticalAlign: 'center'
    });
  });

  it('should create CustomButtonIcon if small, else should create button', () => {
    driver.mount(CustomButton, {...sampleItemViewProps, small: false});
    expect(driver.find.hook('custom-button-button').length).to.equal(1);
    expect(driver.find.selector('CustomButtonIcon').length).to.equal(0);

    driver.mount(CustomButton, {...sampleItemViewProps, small: true});
    expect(driver.find.hook('custom-button-button').length).to.equal(0);
    expect(driver.find.selector('CustomButtonIcon').length).to.equal(1);
  });

  it('Button text should be correct', () => {
    //if not small && styleParams:customButtonText is set: text should be as the prop 'customButtonText'
    Object.assign(sampleItemViewProps.styleParams, {
      customButtonText: 'test'
    });
    driver.mount(CustomButton, {...sampleItemViewProps, small: false});
    expect(driver.find.hook('custom-button-button').text()).to.equal('test');

    //if not small && styleParams:customButtonText is empty && isStoreGallery: text should be 'Buy Now'
    Object.assign(sampleItemViewProps.styleParams, {
      customButtonText: ''
    });
    let stub = sinon.stub(utils, 'isStoreGallery').returns(true);
    driver.mount(CustomButton, {...sampleItemViewProps, small: false});
    expect(driver.find.hook('custom-button-button').text()).to.equal('Buy Now');
    stub.restore(stub);

    //if not small && styleParams:customButtonText is empty && NOT isStoreGallery: text should be 'Click here'
    stub = sinon.stub(utils, 'isStoreGallery').returns(false);
    driver.mount(CustomButton, {...sampleItemViewProps, small: false});
    expect(driver.find.hook('custom-button-button').text()).to.equal('Click here');
    stub.restore();
  });

});

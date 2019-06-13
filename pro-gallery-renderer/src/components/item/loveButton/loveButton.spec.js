import LoveButton from './loveButton.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import { mount } from 'enzyme';
import React from 'react';
import { use, spy, expect } from 'chai';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import { itemActions } from '@wix/photography-client-lib/dist/src/item/itemActions';
import spies from 'chai-spies';
import sinon from 'sinon';

use(spies);

describe('Love Button', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;
  let stub_postLoveActivity;
  let stub_isLoved;
  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps, {
      itemId: 1245,
      isSettings: true,
      showCounter: true,
    });
    stub_postLoveActivity = sinon.stub(itemActions, 'postLoveActivity');
    stub_isLoved = sinon.stub(itemActions, 'toggleLove');
  });
  afterEach(() => {
    stub_postLoveActivity.restore();
    stub_isLoved.restore();
  });

  it('should toggle love', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.get.state().isLoved).to.equal(false);
    driver.find.hook('love-icon').simulate('click');
    expect(driver.get.state().isLoved).to.equal(true);
  });

  it('should increase love count when clicked', () => {
    const stub = sinon.stub(itemActions, 'isLoved').returns(false);
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.get.state().loveCount).to.equal(0);
    driver.find.hook('love-icon').simulate('click');
    expect(driver.get.state().isLoved).to.equal(true);
    expect(driver.find.hook('love-counter').length).to.equal(1);
    expect(driver.find.hook('love-counter').text()).to.equal('1');
    stub.restore();
  });

  it('check item Actions called on toggle', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    expect(stub_isLoved.called).to.be.false;
    expect(stub_postLoveActivity.called).to.be.false;
    driver.find.hook('love-icon').simulate('click');
    expect(stub_isLoved.called).to.be.true;
    expect(stub_postLoveActivity.called).to.be.true;
  });

  it('check mouse Out love button', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    const stub = sinon.stub(itemActions, 'hideTooltip');
    expect(stub.called).to.be.false;
    driver.find.hook('love-button').simulate('mouseout');
    expect(stub.called).to.be.true;
    expect(stub.calledWithExactly()).to.be.true;
    stub.restore();
  });

  it('check mouse Over love button', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    const stub = sinon.stub(itemActions, 'showTooltip');
    expect(stub.called).to.be.false;
    driver.find.hook('love-icon').simulate('click');
    driver.find.hook('love-button').simulate('mouseover');
    expect(stub.called).to.be.true;
    stub.restore();
  });
});

import LoveButton from './loveButton.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import { use, expect } from 'chai';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import { itemActions } from '@wix/photography-client-lib/dist/src/item/itemActions';
import spies from 'chai-spies';
import sinon from 'sinon';
import EVENTS from '../../../utils/constants/events';

use(spies);

describe('Love Button', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;
  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps, {
      itemId: 1245,
      isSettings: true,
      showCounter: true,
    });
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
  it('check eventsListener called on toggle', () => {
    const stub = sinon.stub(sampleItemViewProps.actions, 'eventsListener');
    driver.mount(LoveButton, sampleItemViewProps);
    driver.find.hook('love-icon').simulate('click');
    expect(stub.calledWith(EVENTS.LOVE_BUTTON_CLICKED)).to.be.true;
    stub.restore();
  });
});

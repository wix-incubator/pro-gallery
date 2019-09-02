import LoveButton from './loveButton.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import { use, expect } from 'chai';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import spies from 'chai-spies';
import sinon from 'sinon';
import EVENTS from '../../../constants/events';

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
      showCounter: true,
      isLoved: false,
      loveCount: 0,
    });
  });

  it('should toggle love', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.get.state().loveButtonToggledToLove).to.equal(undefined);
    driver.find.hook('love-icon').simulate('click');
    expect(driver.get.state().loveButtonToggledToLove).to.equal(true);
  });

  it('should increase love count when clicked', () => {
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.get.state().loveButtonToggledToLove).to.equal(undefined);
    driver.find.hook('love-icon').simulate('click');
    expect(driver.get.state().loveButtonToggledToLove).to.equal(true);
    expect(driver.find.hook('love-counter').length).to.equal(1);
    expect(driver.find.hook('love-counter').text()).to.equal('1');
  });
  it('check eventsListener called on toggle', () => {
    const stub = sinon.stub(sampleItemViewProps.actions, 'eventsListener');
    driver.mount(LoveButton, sampleItemViewProps);
    driver.find.hook('love-icon').simulate('click');
    expect(stub.calledWith(EVENTS.LOVE_BUTTON_CLICKED)).to.be.true;
    stub.restore();
  });
});

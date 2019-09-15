import LoveButton from './loveButton.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import { use, expect } from 'chai';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import spies from 'chai-spies';
import sinon from 'sinon';
import EVENTS from '../../../common/constants/events';

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

  it('check eventsListener called on toggle', () => {
    const stub = sinon.stub(sampleItemViewProps.actions, 'eventsListener');
    driver.mount(LoveButton, sampleItemViewProps);
    driver.find.hook('love-icon').simulate('click');
    expect(stub.calledWith(EVENTS.LOVE_BUTTON_CLICKED)).to.be.true;
    stub.restore();
  });
  it('should show loved when isLoved', () => {
    Object.assign(sampleItemViewProps, {
      isLoved: true,
      loveCount: 1,
    });
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.find.hook('love-counter').length).to.equal(1);
    expect(driver.find.hook('love-counter').text()).to.equal('1');
    expect(driver.find.class('progallery-svg-font-icons-love_full').length).to.equal(1);
    expect(driver.find.class('pro-gallery-loved').length).to.equal(1);
    expect(driver.find.class('progallery-svg-font-icons-love_empty').length).to.equal(0);
  });

  it('should show not loved when not isLoved', () => {
    Object.assign(sampleItemViewProps, {
      isLoved: false,
    });
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.find.class('progallery-svg-font-icons-love_empty').length).to.equal(1);
    expect(driver.find.class('progallery-svg-font-icons-love_full').length).to.equal(0);
    expect(driver.find.class('pro-gallery-loved').length).to.equal(0);
  });

  it('should show correct live count', () => {
    Object.assign(sampleItemViewProps, {
      isLoved: false,
      loveCount: 10,
    });
    driver.mount(LoveButton, sampleItemViewProps);
    expect(driver.find.hook('love-counter').length).to.equal(1);
    expect(driver.find.hook('love-counter').text()).to.equal('10');
  });
});

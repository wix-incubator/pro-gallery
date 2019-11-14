import CustomButton from '../../../../src/components/item/buttons/customButton.js';
import { use, expect } from 'chai';
import spies from 'chai-spies';
import GalleryDriver from '../../../drivers/reactDriver';
import { testImages } from '../../../drivers/mocks/images-mock';

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
      galleryVerticalAlign: 'center',
    });
  });

  it('should create CustomButtonIcon if small, else should create button', () => {
    driver.mount(CustomButton, { ...sampleItemViewProps, small: false });
    expect(driver.find.hook('custom-button-button').length).to.equal(1);
    expect(driver.find.selector('CustomButtonIcon').length).to.equal(0);

    driver.mount(CustomButton, { ...sampleItemViewProps, small: true });
    expect(driver.find.hook('custom-button-button').length).to.equal(0);
    expect(driver.find.selector('CustomButtonIcon').length).to.equal(1);
  });

  it('Button text should be correct', () => {
    driver.mount(CustomButton, {
      ...sampleItemViewProps,
    });
    expect(driver.find.hook('custom-button-button').text()).to.equal(
      'Click here',
    );
    //if not small && styleParams:customButtonText is set: text should be as the prop 'customButtonText'
    Object.assign(sampleItemViewProps.styleParams, {
      customButtonText: 'test',
    });
    driver.mount(CustomButton, { ...sampleItemViewProps, small: false });
    expect(driver.find.hook('custom-button-button').text()).to.equal('test');
  });
});

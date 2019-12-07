import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'
import INFO_BEHAVIOUR_ON_HOVER from '../../src/common/constants/infoBehaviourOnHover'

describe('styleParam - hoveringBehaviour', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  }
  

  beforeEach(() => {
    driver = new GalleryDriver();
  });


  it('should add class "simulate-hover" on hover when when "hoveringBehaviour" is "APPEAR"', async () => {
    Object.assign(initialProps.styles, {
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.APPEARS,
    })
    driver.mount.proGallery(initialProps);
    let item = driver.find.hook('item-container').at(0);
    item.simulate('mouseOver');
    item = driver.find.hook('item-container').at(0);
    expect(item.find('.force-hover').length).to.eq(1);
    driver.detach.proGallery();
  });
  it('should add class "force-hover" on hover when "hoveringBehaviour" is "APPEAR"', () => {
    Object.assign(initialProps.styles, {
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.APPEARS,
    })
    driver.mount.proGallery(initialProps);
    let item = driver.find.hook('item-container').at(0);
    item.simulate('mouseOver');
    item = driver.find.hook('item-container').at(0);

    expect(item.find('.force-hover').length).to.eq(1);
    driver.detach.proGallery();
  });
  it('should have class invert-hover when "hoveringBehaviour" is "DISAPPEARS"', () => {
    Object.assign(initialProps.styles, {
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.DISAPPEARS,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0); 
    expect(item.hasClass('invert-hover')).to.be.true;
    driver.detach.proGallery();
  });
  it('should have default class force-hover when "hoveringBehaviour" is "NO_CHANGE"', () => {
    Object.assign(initialProps.styles, {
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.NO_CHANGE,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.force-hover'); 
    expect(items.length).to.greaterThan(1);
    driver.detach.proGallery();
  });
})
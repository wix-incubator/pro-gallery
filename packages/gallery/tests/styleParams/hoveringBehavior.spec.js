import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'
import INFO_BEHAVIOUR_ON_HOVER from '../../src/common/constants/infoBehaviourOnHover';
import PLACEMENTS from '../../src/common/constants/placements';

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

  it('should not have class "force-hover" when there is no hover event (when "hoveringBehaviour" is "APPEARS")', () => {
    Object.assign(initialProps.styles, {
      // titlePlacement also deals with the hover on items. when it's value is 'SHOW_ON_HOVER', hoveringBehaviour takes controll.
      titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.APPEARS,
    })
    driver.mount.proGallery(initialProps);
    let item = driver.find.hook('item-container').at(0);
    item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });

  it('should not have class "force-hover" when there is no hover event (when "hoveringBehaviour" is "DISAPPEARS")', () => {
    Object.assign(initialProps.styles, {
      // titlePlacement also deals with the hover on items. when it's value is 'SHOW_ON_HOVER', hoveringBehaviour takes controll.
      titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.DISAPPEARS,
    })
    driver.mount.proGallery(initialProps);
    let item = driver.find.hook('item-container').at(0);
    item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should have class invert-hover when "hoveringBehaviour" is "DISAPPEARS"', () => {
    Object.assign(initialProps.styles, {
      titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.DISAPPEARS,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    // test for "invert-hover" class on items 
    expect(item.hasClass('invert-hover')).to.be.true;
    driver.detach.proGallery();
  });
  it('should have default class force-hover when "hoveringBehaviour" is "NO_CHANGE"', () => {
    Object.assign(initialProps.styles, {
      titlePlacement: PLACEMENTS.SHOW_ON_HOVER,
      hoveringBehaviour: INFO_BEHAVIOUR_ON_HOVER.NO_CHANGE,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.force-hover');
    // when the value is "NO_CHANGE" all items will be in a constant state of hover 
    expect(items.length).to.greaterThan(1);
    driver.detach.proGallery();
  });
})
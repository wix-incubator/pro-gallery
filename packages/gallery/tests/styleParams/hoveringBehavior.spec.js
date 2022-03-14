import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - hoveringBehaviour', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
  });

  it('should not have class "force-hover" when there is no hover event (when "hoveringBehaviour" is "APPEARS")', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      // titlePlacement also deals with the hover on items. when it's value is 'SHOW_ON_HOVER', hoveringBehaviour takes controll.
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });

  it('should not have class "force-hover" when there is no hover event (when "hoveringBehaviour" is "DISAPPEARS")', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      // titlePlacement also deals with the hover on items. when it's value is 'SHOW_ON_HOVER', hoveringBehaviour takes controll.
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should have class invert-hover when "hoveringBehaviour" is "DISAPPEARS"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    // test for "invert-hover" class on items
    expect(item.hasClass('invert-hover')).to.be.true;
    driver.detach.proGallery();
  });
  it('should have default class force-hover when "hoveringBehaviour" is "NO_CHANGE"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.force-hover');
    // when the value is "NO_CHANGE" all items will be in a constant state of hover
    expect(items.length).to.greaterThan(1);
    driver.detach.proGallery();
  });
});

import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_overlay_hoveringBehaviour', () => {
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

  it('should not have class "force-hover" when there is no hover event (when "behaviourParams_item_overlay_hoveringBehaviour" is "APPEARS")', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      // layoutParams_info_placement also deals with the hover on items. when it's value is 'OVERLAY', hoveringBehaviour takes controll.
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });

  it('should not have class "force-hover" when there is no hover event (when "behaviourParams_item_overlay_hoveringBehaviour" is "DISAPPEARS")', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      // layoutParams_info_placement also deals with the hover on items. when it's value is 'OVERLAY', hoveringBehaviour takes controll.
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].DISAPPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    //test for "force-hover" class after simulating hover event
    expect(item.find('.force-hover').length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should have class invert-hover when "behaviourParams_item_overlay_hoveringBehaviour" is "DISAPPEARS"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].DISAPPEARS,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    // test for "invert-hover" class on items
    expect(item.hasClass('invert-hover')).to.be.true;
    driver.detach.proGallery();
  });
  it('should have default class force-hover when "behaviourParams_item_overlay_hoveringBehaviour" is "ALWAYS_SHOW"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].ALWAYS_SHOW,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.force-hover');
    // when the value is "NO_CHANGE" all items will be in a constant state of hover
    expect(items.length).to.greaterThan(1);
    driver.detach.proGallery();
  });
});

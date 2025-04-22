import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2, videoItems } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_clickAction', () => {
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

  describe('should set the correct role for each "behaviourParams_item_clickAction" value', () => {
    it('expect "role" to be "link" when "behaviourParams_item_clickAction" is "link"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props().role).to.eq('link');
      driver.detach.proGallery();
    });

    it('expect "role" to be "button" when "behaviourParams_item_clickAction" is "ACTION"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props().role).to.eq('button');
      driver.detach.proGallery();
    });
    it('expect no "role" attribute when "behaviourParams_item_clickAction" is "nothing"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props()).to.not.have.property('role');
      driver.detach.proGallery();
    });
  });

  describe('should set className "clickable" when "behaviourParams_item_clickAction" is "action/link"', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: images2,
        options,
      };
    });
    it('expect item to have className "clickable" when "behaviourParams_item_clickAction" is "link"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to have className "clickable" when "behaviourParams_item_clickAction" is "action"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect "role" to be "" when "itemClick" is "nothing"', async () => {
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to not have className "clickable" when "behaviourParams_item_clickAction" is "nothing"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.false;
      driver.detach.proGallery();
    });
  });

  describe('should set href link only when "behaviourParams_item_clickAction" is set to "link"', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: images2,
        options,
      };
    });
    it('check href when behaviourParams_item_clickAction = link', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('#pro-gallery-container-default-dom-id a').at(0);
      console.log(item);
      expect(item.props().href).to.not.be.undefined;
      driver.detach.proGallery();
    });
    it('check href when behaviourParams_item_clickAction = action', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('#pro-gallery-container-default-dom-id div').at(0);
      expect(item.props().href).to.be.undefined;
      driver.detach.proGallery();
    });
  });
  describe('should play video onClick in gallery only when behaviourParams_item_clickAction is nothing and behaviourParams_item_video_playTrigger is CLICK', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: videoItems,
        options,
      };
    });

    it('expect to find video element', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      await driver.update(100);
      const item = driver.find.hook('item-wrapper').at(0);
      item.simulate('click');
      await driver.update(100);
      expect(driver.find.tag('video').length).to.eq(2); //all videos load after the first interaction (2 in the items array)
      driver.detach.proGallery();
    });

    it('expect not to find video element when "behaviourParams_item_clickAction" is "action"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      await driver.update(100);
      const item = driver.find.hook('item-wrapper').at(0);
      item.simulate('click');
      expect(driver.find.tag('video').length).to.eq(0);

      driver.detach.proGallery();
    });
    it('expect not to find video element when "behaviourParams_item_clickAction" is "link"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      await driver.update(100);
      const item = driver.find.hook('item-wrapper').at(0);
      item.simulate('click');
      expect(driver.find.tag('video').length).to.eq(0);

      driver.detach.proGallery();
    });
  });

  describe('behaviourParams_item_clickAction = "MAGNIFY"', () => {
    const mountAndGetMagnifiedItems = async (galleryDriver, selector = '.magnified-item-container') => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].MAGNIFY,
      });
      galleryDriver.mount.proGallery(initialProps);
      await galleryDriver.update();
      return galleryDriver.find.selector(selector);
    };
    it('should have magnification container', async () => {
      const items = await mountAndGetMagnifiedItems(driver);
      expect(items.length).to.not.eq(0);
      driver.detach.proGallery();
    });

    it('should render magnified images', async () => {
      const items = await mountAndGetMagnifiedItems(driver);
      const item = items.at(0);
      item.simulate('mouseup');
      expect(driver.find.selector('.magnified-images').length).to.be.greaterThan(0);
      driver.detach.proGallery();
    });
    it('should have default styles', async () => {
      const items = await mountAndGetMagnifiedItems(driver);
      const magnificationContainer = items.at(0);
      console.log(magnificationContainer.props().style);
      expect(magnificationContainer.props().style).to.deep.equal({
        width: 420,
        height: 420,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'zoom-in',
      });
      driver.detach.proGallery();
    });
  });
});

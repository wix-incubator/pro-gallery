import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2, videoItems } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('options - itemClick', () => {
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

  describe('should set the correct role for each "itemClick" value', () => {
    it('expect "role" to be "link" when "itemClick" is "link"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props().role).to.eq('link');
      driver.detach.proGallery();
    });
    it('expect "role" to be "button" when "itemClick" is "expand"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props().role).to.eq('button');
      driver.detach.proGallery();
    });
    it('expect "role" to be "button" when "itemClick" is "fullscreen"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'fullscreen',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props().role).to.eq('button');
      driver.detach.proGallery();
    });
    it('expect no "role" attribute when "itemClick" is "nothing"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'nothing',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-action').at(3);
      expect(item.props()).to.not.have.property('role');
      driver.detach.proGallery();
    });
  });

  describe('should set className "clickable" when "itemClick" is "expand/fullscreen/link"', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: images2,
        options,
      };
    });
    it('expect item to have className "clickable" when "itemClick" is "link"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to have className "clickable" when "itemClick" is "expand"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to have className "clickable" when "itemClick" is "fullscreen"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'fullscreen',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to not have className "clickable" when "itemClick" is "nothing"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'nothing',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.false;
      driver.detach.proGallery();
    });
  });

  describe('should set href link only when "itemClick" is set to "link"', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: images2,
        options,
      };
    });
    it('check href when itemClick = link', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find
        .selector('#pro-gallery-container-default-dom-id a')
        .at(0);
      console.log(item);
      expect(item.props().href).to.not.be.undefined;
      driver.detach.proGallery();
    });
    it('check href when itemClick = expand', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find
        .selector('#pro-gallery-container-default-dom-id div')
        .at(0);
      expect(item.props().href).to.be.undefined;
      driver.detach.proGallery();
    });
  });
  describe('should play video onClick in gallery only when itemClick is nothing and videoPlay is onClick', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: videoItems,
        options,
      };
    });

    it('expect to find video element', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'nothing',
        videoPlay: 'onClick',
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
    it('expect not to find video element when "itemClick" is "expand"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'expand',
        videoPlay: 'onClick',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      await driver.update(100);
      const item = driver.find.hook('item-wrapper').at(0);
      item.simulate('click');
      expect(driver.find.tag('video').length).to.eq(0);
      driver.detach.proGallery();
    });
    it('expect not to find video element when "itemClick" is "fullscreen"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'fullscreen',
        videoPlay: 'onClick',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      await driver.update(100);
      const item = driver.find.hook('item-wrapper').at(0);
      item.simulate('click');
      expect(driver.find.tag('video').length).to.eq(0);

      driver.detach.proGallery();
    });
    it('expect not to find video element when "itemClick" is "link"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: 'link',
        videoPlay: 'onClick',
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

  describe('itemClick = "MAGNIFY"', () => {
    const mountAndGetMagnifiedItems = async (
      galleryDriver,
      selector = '.magnified-item-container'
    ) => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        itemClick: GALLERY_CONSTS.itemClick.MAGNIFY,
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
      expect(
        driver.find.selector('.magnified-images').length
      ).to.be.greaterThan(0);
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

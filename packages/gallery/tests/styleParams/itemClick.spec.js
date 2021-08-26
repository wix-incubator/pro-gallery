import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects, GALLERY_CONSTS } from 'pro-gallery-lib';
import { images2, videoItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - itemClick', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      styles: styleParams,
    };
  });

  describe('should set the correct role for each "itemClick" value', () => {
    it('expect "role" to be "link" when "itemClick" is "link"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.props().role).to.eq('link');
      driver.detach.proGallery();
    });
    it('expect "role" to be "button" when "itemClick" is "expand"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.props().role).to.eq('button');
      driver.detach.proGallery();
    });
    it('expect "role" to be "button" when "itemClick" is "fullscreen"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'fullscreen',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.props().role).to.eq('button');
      driver.detach.proGallery();
    });
    it('expect "role" to be "" when "itemClick" is "nothing"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'nothing',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.props().role).to.eq('');
      driver.detach.proGallery();
    });
  });

  describe('should set className "clickable" when "itemClick" is "expand/fullscreen/link"', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
      initialProps = {
        container,
        items: images2,
        styles: styleParams,
      };
    });
    it('expect item to have className "clickable" when "itemClick" is "link"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to have className "clickable" when "itemClick" is "expand"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to have className "clickable" when "itemClick" is "fullscreen"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'fullscreen',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-container').at(3);
      expect(item.hasClass('clickable')).to.be.true;
      driver.detach.proGallery();
    });
    it('expect item to not have className "clickable" when "itemClick" is "nothing"', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
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
        styles: styleParams,
      };
    });
    it('check href when itemClick = link', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'link',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('#pro-gallery-container a').at(0);
      expect(item.props().href).to.not.be.undefined;
      driver.detach.proGallery();
    });
    it('check href when itemClick = expand', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'expand',
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('#pro-gallery-container a').at(0);
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
        styles: styleParams,
      };
    });

    it('expect to find video element', async () => {
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'nothing',
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
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
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'expand',
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
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
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'fullscreen',
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
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
      initialProps.styles = mergeNestedObjects(initialProps.styles, {
        itemClick: 'link',
        behaviourParams: {
          item: {
            video: {
              playTrigger: GALLERY_CONSTS.videoPlay.CLICK,
            },
          },
        },
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
});

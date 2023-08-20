import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { videoItems } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_video_playTrigger', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: videoItems,
      options,
    };
  });

  it('should play videos automaticaly', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.item.video.playTrigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].AUTO,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
    });
    driver.mount.proGallery(initialProps);
    await driver.update(500);
    const galleryVideoItems = driver.find.hook('video_container-video-player-element');
    expect(galleryVideoItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });

  describe('behaviourParams_item_video_playTrigger - HOVER', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no hover event)', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER,
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on hover', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER,
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const itemContainer = driver.find.hook('item-container').at(0);
      itemContainer.simulate('mouseEnter');
      const videoItem = driver.find.tag('video');
      expect(videoItem).to.have.lengthOf(2);
      driver.detach.proGallery();
    });
  });

  describe('behaviourParams_item_video_playTrigger - CLICK', () => {
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('should not have video elements intially (with no click event)', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const galleryVideoItems = driver.find.tag('video');
      expect(galleryVideoItems).to.have.lengthOf(0);
      driver.detach.proGallery();
    });
    it('should have video element on click', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.behaviourParams.item.video.playTrigger]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
        [optionsMap.behaviourParams.item.clickAction]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const itemContainer = driver.find.hook('item-wrapper').at(0);
      itemContainer.simulate('click');
      const videoItem = driver.find.tag('video');
      expect(videoItem).to.have.lengthOf(2);
      driver.detach.proGallery();
    });
  });
});

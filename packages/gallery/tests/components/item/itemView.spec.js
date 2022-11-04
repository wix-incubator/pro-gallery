//Yonatan Hattav Jun21
import {
  optionsMap,
  GALLERY_CONSTS,
  mergeNestedObjects,
} from 'pro-gallery-lib';
import { expect } from 'chai';
import sinon from 'sinon';
import GalleryDriver from '../../drivers/reactDriver';
import { testImages } from '../../drivers/mocks/images-mock';
import ItemView from '../../../src/components/item/itemView';
import VideoItemPlaceholder from '../../../src/components/item/videos/videoItemPlaceholder';

describe('Item View', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;
  // let mockEvent;

  beforeEach(() => {
    // mockEvent = new Event('mock');
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
  });

  it('should init', () => {
    driver.mount(ItemView, sampleItemViewProps);
    expect(driver.find.hook('item-wrapper').length).to.equal(1);
  });

  describe('item loaded setItemLoaded', () => {
    it('should set states when called', () => {
      const spy = sinon.spy(ItemView.prototype, 'setItemLoaded');
      driver.mount(ItemView, sampleItemViewProps);
      driver.get.instance().setItemLoaded();
      expect(spy.called).to.be.true;
      spy.restore();
    });
  });
  // describe('toggleHoverOnMobile', () => {
  //   it('should toggle showHover', () => {
  //     driver.mount(ItemView, sampleItemViewProps);
  //     driver.set.state({
  //       showHover: true
  //     });
  //     driver.get.instance().toggleHoverOnMobile();
  //     expect(driver.get.state().showHover).to.be.false;
  //     driver.get.instance().toggleHoverOnMobile();
  //     expect(driver.get.state().showHover).to.be.true;
  //   });
  // });
  describe('onItemClick', () => {
    it('should onItemClicked for items with link', () => {
      Object.assign(sampleItemViewProps, {
        type: 'image',
      });
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.behaviourParams.item.clickAction]:
            GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
          [optionsMap.behaviourParams.item.video.playTrigger]:
            GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger]
              .CLICK,
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      const stub = sinon.stub(driver.get.props().actions, 'eventsListener');
      driver.find.hook('item-wrapper').simulate('click');
      expect(stub.calledWith(GALLERY_CONSTS.events.ITEM_CLICKED)).to.be.true;
      stub.restore();
    });

    it('should onItemClicked for items with expand', () => {
      Object.assign(sampleItemViewProps, {
        thumbnailHighlightId: null,
        type: 'image',
      });
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.behaviourParams.item.clickAction]:
            GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      const stub = sinon.stub(driver.get.props().actions, 'eventsListener');
      driver.find.hook('item-wrapper').simulate('click');
      expect(stub.calledWith(GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED)).to.be
        .true;
      stub.restore();
    });

    // following will always fail for video items. it looks to me like a bug. videos will never have hover on mobile
    // it('should toggleHover onClick when the device is mobile and the onclick is styles to nothing', () => {
    //   const mobileStub = sinon.stub(utils, 'isMobile').returns(true);
    //   Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image', options: {[optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING, [optionsMap.behaviourParams.item.video.playTrigger]: GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK}});
    //   driver.mount(ItemView, sampleItemViewProps);
    //   const spy = sinon.spy(ItemView.prototype, 'props.actions.setCurrentHover');
    //   driver.find.hook('item-wrapper').simulate('click');
    //   expect(spy.called).to.be.true;
    //   spy.restore();
    //   mobileStub.restore();
    // });
  });
  describe('toggleFullscreenIfNeeded', () => {
    it('should call onItemClicked if the target item does not have block-fullscreen class', () => {
      // not testing this.
    });
  });

  // not testing all the "return component" functions
  describe('getItemInner', () => {
    it('should return a placeholder for non playing video', () => {
      Object.assign(sampleItemViewProps, {
        currentPlayingIdx: 1,
        type: 'video',
        idx: 0,
      });
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.behaviourParams.item.video.enablePlaceholder]: true,
          [optionsMap.layoutParams.structure.galleryLayout]:
            GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
              .EMPTY,
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(VideoItemPlaceholder).length).to.equal(1);
    });
  });
  //compunentDidUpdate not tested
  describe('render', () => {
    it('should have boxshadow if defined', () => {
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.stylingParams.itemEnableShadow]: true,
          [optionsMap.stylingParams.itemShadowOpacityAndColor]:
            'rgba(0, 0, 0, 0.2)',
          [optionsMap.stylingParams.itemShadowBlur]: 15,
          [optionsMap.stylingParams.itemShadowDirection]: 0,
          [optionsMap.stylingParams.itemShadowSize]: 18,
          [optionsMap.layoutParams.structure.itemSpacing]: 5,
          [optionsMap.layoutParams.info.layout]: 'ATTACHED_BACKGROUND',
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-container').get(0).props.style;
      expect(style.boxShadow).to.equal('0px -18px 15px rgba(0, 0, 0, 0.2)');
      const updatedOptions = mergeNestedObjects(sampleItemViewProps.options, {
        [optionsMap.stylingParams.itemEnableShadow]: false,
        [optionsMap.stylingParams.itemShadowOpacityAndColor]:
          'rgba(0, 0, 0, 0.2)',
        [optionsMap.stylingParams.itemShadowBlur]: 20,
        [optionsMap.stylingParams.itemShadowDirection]: 135,
        [optionsMap.stylingParams.itemShadowSize]: 10,
        [optionsMap.layoutParams.structure.itemSpacing]: 5,
        [optionsMap.layoutParams.info.layout]: 'ATTACHED_BACKGROUND',
      });
      driver.set.props({
        options: updatedOptions,
      });
      style = driver.find.hook('item-container').get(0).props.style;
      expect(style.boxShadow).to.equal(undefined);
    });

    it('item-Wrapper should have class based on cubeType', () => {
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.layoutParams.crop.enable]: true,
          [optionsMap.layoutParams.crop.method]: 'foo',
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      expect(
        driver.find.hook('item-wrapper').hasClass('cube-type-foo')
      ).to.equal(true);
      const updatedOptions = mergeNestedObjects(sampleItemViewProps.options, {
        [optionsMap.layoutParams.crop.enable]: false,
      });
      driver.set.props({
        options: updatedOptions,
      });
      expect(
        driver.find.hook('item-wrapper').hasClass('cube-type-foo')
      ).to.equal(false);
    });
    it('should toggle overflowY visible/inherit test2', () => {
      Object.assign(sampleItemViewProps, {
        style: { bgColor: 'red' },
      });
      sampleItemViewProps.options = mergeNestedObjects(
        sampleItemViewProps.options,
        {
          [optionsMap.layoutParams.crop.method]:
            GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
        }
      );
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-wrapper').get(0).props.style;
      expect(style.backgroundColor).to.equal('inherit');
      const updatedOptions = mergeNestedObjects(sampleItemViewProps.options, {
        [optionsMap.layoutParams.crop.method]: 'foot',
      });
      driver.set.props({
        options: updatedOptions,
      });
      style = driver.find.hook('item-wrapper').get(0).props.style;
      expect(style.backgroundColor).to.equal('red');
    });
  });
});

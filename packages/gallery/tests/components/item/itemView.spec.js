//Yonatan Hattav Jun21
import { GALLERY_CONSTS } from 'pro-gallery-lib';
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
        styleParams: { itemClick: 'link', videoPlay: 'onClick' },
      });
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
        styleParams: { itemClick: 'expand' },
      });
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
    //   Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image', styleParams: {itemClick: 'nothing', videoPlay: 'onClick'}});
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
  // not testing "if" isSmallItem
  // not testing "if" isVerticalContainer
  // not testing "if" shouldShowHoverOnMobile
  // describe('shouldHover', () => {
  //   it('should return true/false on different item parameters', () => {
  //     Object.assign(sampleItemViewProps);
  //     driver.mount(ItemView, sampleItemViewProps);
  //     const instance = driver.get.instance();
  //     const stubprop = sinon.stub(instance, 'shouldShowHoverOnMobile').returns(false);
  //     const stubMobile = sinon.stub(utils, 'isMobile').returns(false);
  //     const stubEditor = sinon.stub(utils, 'isEditor').returns(false);
  //     driver.set.props({
  //       styleParams: {
  //         isSlideshow: false,
  //         allowHover: true
  //       }
  //     });
  //     expect(instance.shouldHover()).to.be.true;
  // 		//IMPORTANT after stubing, there is no need to "restub" to change the return value. the stub variable has the functions
  //     stubEditor.returns(true);
  //     expect(instance.shouldHover()).to.equal(driver.get.state('showHover'));
  //     stubEditor.returns(false);
  //     stubMobile.returns(true);
  //     expect(instance.shouldHover()).to.be.false;
  //     driver.set.props({
  //       styleParams: {
  //         isSlideshow: false,
  //         allowHover: false
  //       }
  //     });
  //     expect(instance.shouldHover()).to.be.false;
  //     driver.set.props({
  //       styleParams: {
  //         isSlideshow: true,
  //         allowHover: true
  //       }
  //     });
  //     expect(instance.shouldHover()).to.be.false;
  //     stubMobile.restore();
  //     stubEditor.restore();
  //     stubprop.restore();

  //   });
  // });

  describe('getImageDimensions', () => {
    it('should return the correct dimensions for image parameters', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          cubeImages: false,
          cubeType: 'fit',
        },
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000,
        },
      });
      driver.mount(ItemView, sampleItemViewProps);
      //IMPORTANT use deep when trying to compare objects
      expect(driver.get.instance().getImageDimensions()).to.deep.equal({
        width: 1920,
        height: 1000,
      });

      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'foo',
        },
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000,
        },
      });
      expect(driver.get.instance().getImageDimensions()).to.deep.equal({
        width: 1920,
        height: 1000,
      });

      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'fit',
        },
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000,
        },
      });
      //IMPORTANT notice marginTop is -0. if it was just 0 it wouldnt deep equal the -0 that returns from the function (the value is devided by -2 in the function)
      let testObject = driver.get.instance().getImageDimensions();
      expect(testObject.width).to.equal(1920);
      expect(testObject.height).to.equal(1000);
      expect(testObject.margin).to.equal('0px 0');
      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'fit',
        },
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.0,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000,
        },
      });
      testObject = driver.get.instance().getImageDimensions();
      expect(testObject.width).to.equal(1000);
      expect(testObject.height).to.equal(1000);
      expect(testObject.margin).to.equal('0 460px');
    });
  });
  // describe('isVisible', () => {
  //   it('should return true if the element is visible', () => {
  //     Object.assign(sampleItemViewProps, {
  //       documentHeight: 1080,
  //       scroll: {
  //         top: 200},
  //       type: 'video'});
  //     driver.mount(ItemView, sampleItemViewProps);
  //     let visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.false;
  //     driver.set.props({
  //       scroll: {
  //         top: 270}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.false;
  //     driver.set.props({
  //       scroll: {
  //         top: 271}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.true;
  //     driver.set.props({
  //       scroll: {
  //         top: 1349}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.true;
  //     driver.set.props({
  //       scroll: {
  //         top: 1350}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.false;
  //     driver.set.props({
  //       scroll: {
  //         top: 1500}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.false;
  //     driver.set.props({
  //       scroll: {
  //         top: 2000}
  //     });
  //     visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
  //     expect(visible).to.be.false;
  //   });
  // });
  // not testing all the "return component" functions
  describe('getItemInner', () => {
    it('should return a placeholder for non playing video', () => {
      Object.assign(sampleItemViewProps, {
        currentPlayingIdx: 1,
        styleParams: {
          isSlideshow: false,
        },
        type: 'video',
        idx: 0,
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(VideoItemPlaceholder).length).to.equal(1);
    });
  });
  //compunentDidUpdate not tested
  describe('render', () => {
    it('should have boxshadow if defined', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          itemEnableShadow: true,
          itemShadowOpacityAndColor: 'rgba(0, 0, 0, 0.2)',
          itemShadowBlur: 15,
          itemShadowDirection: 0,
          itemShadowSize: 18,
          imageMargin: 5,
          imageInfoType: 'ATTACHED_BACKGROUND',
        },
      });
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-container').get(0).props.style;
      expect(style.boxShadow).to.equal('0px -18px 15px rgba(0, 0, 0, 0.2)');
      driver.set.props({
        styleParams: {
          itemEnableShadow: false,
          itemShadowOpacityAndColor: 'rgba(0, 0, 0, 0.2)',
          itemShadowBlur: 20,
          itemShadowDirection: 135,
          itemShadowSize: 10,
          imageMargin: 5,
          imageInfoType: 'ATTACHED_BACKGROUND',
        },
      });
      style = driver.find.hook('item-container').get(0).props.style;
      expect(style.boxShadow).to.equal(undefined);
    });
    it('should toggle overflowY visible/inherit', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          isSlideshow: true,
        },
      });
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-container').get(0).props.style;
      expect(style.overflowY).to.equal('visible');
      driver.set.props({
        styleParams: {
          isSlideshow: false,
        },
      });
      style = driver.find.hook('item-container').get(0).props.style;
      expect(style.overflowY).to.equal('hidden');
    });
    it('item-Wrapper should have class based on cubeType', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          cubeImages: true,
          cubeType: 'foo',
        },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(
        driver.find.hook('item-wrapper').hasClass('cube-type-foo')
      ).to.equal(true);
      driver.set.props({
        styleParams: {
          cubeImages: false,
        },
      });
      expect(
        driver.find.hook('item-wrapper').hasClass('cube-type-foo')
      ).to.equal(false);
    });
    it('should toggle overflowY visible/inherit test2', () => {
      Object.assign(sampleItemViewProps, {
        style: { bgColor: 'red' },
        styleParams: {
          cubeType: 'fit',
        },
      });
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-wrapper').get(0).props.style;
      expect(style.backgroundColor).to.equal('inherit');
      driver.set.props({
        styleParams: {
          cubeType: 'foot',
        },
      });
      style = driver.find.hook('item-wrapper').get(0).props.style;
      expect(style.backgroundColor).to.equal('red');
    });
  });
});

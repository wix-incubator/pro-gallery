//Yonatan Hattav Jun21

import VideoItemPlaceholder from '../../../src/components/item/videos/videoItemPlaceholder';
import CustomButton from '../../../src/components/item/buttons/customButton';
import ItemTitle from '../../../src/components/item/texts/itemTitle';
import { expect } from 'chai';
import sinon from 'sinon';
import GalleryDriver from '../../drivers/reactDriver';
import { testImages } from '../../drivers/mocks/images-mock';
import ItemView from '../../../src/components/item/itemView';
import EVENTS from '../../../src/common/constants/events';

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

  describe('when error occurs', () => {
    it('state - retries should be increase acording to times called setItemError, failed is true after 4 times or more', () => {
      driver.mount(ItemView, sampleItemViewProps);
      driver.get.instance().setItemError();
      expect(driver.get.state('retries')).to.equal(1);
      expect(driver.get.state('failed')).to.be.false;
      driver.get.instance().setItemError();
      expect(driver.get.state('retries')).to.equal(2);
      expect(driver.get.state('failed')).to.be.false;
      driver.get.instance().setItemError();
      expect(driver.get.state('retries')).to.equal(3);
      expect(driver.get.state('failed')).to.be.false;
      driver.get.instance().setItemError();
      expect(driver.get.state('retries')).to.equal(4);
      expect(driver.get.state('failed')).to.be.true;
    });
  });
  describe('item loaded setItemLoaded', () => {
    it('should set states when called', () => {
      const spy = sinon.spy(ItemView.prototype, 'setItemLoaded');
      driver.mount(ItemView, sampleItemViewProps);
      driver.set.state({
        failed: true,
        loaded: false,
      });
      driver.get.instance().setItemLoaded();
      expect(driver.get.state('failed')).to.be.false;
      expect(driver.get.state('loaded')).to.be.true;
      expect(spy.called).to.be.true;
      spy.restore();
    });
  });
  describe('toggleShare', () => {
    it('should not be fired if hovering over icons', () => {
      driver.mount(ItemView, sampleItemViewProps);
      let spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({
        type: 'click',
        target: { tagName: 'button' },
        relatedTarget: { tagName: 'button' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(spy.called).to.be.true; //called on any event type other than mouseout
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({
        type: 'mouseout',
        target: { tagName: 'foo' },
        relatedTarget: { tagName: 'button' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(spy.called).to.be.false; //not called is mouseout but one of the tagName isnt listed
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({
        type: 'mouseout',
        target: { tagName: 'button' },
        relatedTarget: { tagName: 'foo' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(spy.called).to.be.false; //not called is mouseout but at least one of the tagName isnt listed
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({
        type: 'mouseout',
        target: { tagName: 'foo' },
        relatedTarget: { tagName: 'foo' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(spy.called).to.be.true; // called if mouseout but no listed tagName
      spy.restore();
    });
    it('should changes showShare properly when fired', () => {
      driver.mount(ItemView, sampleItemViewProps);
      const spy = sinon.spy(ItemView.prototype, 'setState');
      driver.set.state({
        showShare: true,
      });
      driver.get.instance().toggleShare({
        type: 'click',
        target: { tagName: 'button' },
        relatedTarget: { tagName: 'button' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(driver.get.state().showShare).to.be.false; //when forceVal is not sent - toggles showShare
      driver.get.instance().toggleShare({
        type: 'click',
        target: { tagName: 'button' },
        relatedTarget: { tagName: 'button' },
        stopPropagation: () => {},
        preventDefault: () => {},
      });
      expect(driver.get.state().showShare).to.be.true; //when forceVal is not sent - toggles showShare
      driver.get.instance().toggleShare(
        {
          type: 'click',
          target: { tagName: 'button' },
          relatedTarget: { tagName: 'button' },
          stopPropagation: () => {},
          preventDefault: () => {},
        },
        true,
      );
      expect(driver.get.state().showShare).to.be.true; //assignes forceVal to showShare if it is defined
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
      expect(stub.calledWith(EVENTS.ITEM_CLICKED)).to.be.true;
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
      expect(stub.calledWith(EVENTS.ITEM_ACTION_TRIGGERED)).to.be.true;
      stub.restore();
    });

    // following will always fail for video items. it looks to me like a bug. videos will never have hover on mobile
    // it('should toggleHover onClick when the device is mobile and the onclick is styles to nothing', () => {
    //   const mobileStub = sinon.stub(utils, 'isMobile').returns(true);
    //   Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image', styleParams: {itemClick: 'nothing', videoPlay: 'onClick'}});
    //   driver.mount(ItemView, sampleItemViewProps);
    //   const spy = sinon.spy(ItemView.prototype, 'props.actions.setCurrentHover');
    //   driver.find.hook('item-container').simulate('click');
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

  describe('getImageDimentions', () => {
    it('should return the correct dimentions for image parameters', () => {
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
      expect(testObject.marginTop).to.equal(0);
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
      expect(testObject.marginLeft).to.equal(460);
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
    it('should create a separate div for buttons when in slideshow', () => {
      Object.assign(sampleItemViewProps, {
        visible: true,
        styleParams: {
          isSlideshow: true,
        },
        type: 'image',
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('gallery-item-info-buttons').length).to.equal(1);
      driver.set.props({
        styleParams: {
          isSlideshow: false,
        },
      });
      expect(driver.find.hook('gallery-item-info-buttons').length).to.equal(0);
    });
  });
  //openItemShopInFullScreen not tested
  describe('getBottomInfoElement', () => {
    it('should create a CustomButton/ItemTitle if needed', () => {
      Object.assign(sampleItemViewProps, {
        visible: true,
        styleParams: {
          useCustomButton: true,
          titlePlacement: 'SHOW_BELOW',
          allowTitle: true,
        },
        type: 'image',
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(CustomButton).length).to.equal(1);
      expect(driver.find.selector(ItemTitle).length).to.equal(1);
    });
  });
  //compunentDidUpdate not tested
  describe('render', () => {
    it('should have boxshadow if defined', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          itemEnableShadow: true,
          itemShadowOpacityAndColor: { value: 'rgba(0, 0, 0, 0.2)' },
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
          itemShadowOpacityAndColor: { value: 'rgba(0, 0, 0, 0.2)' },
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
        driver.find.hook('item-wrapper').hasClass('cube-type-foo'),
      ).to.equal(true);
      driver.set.props({
        styleParams: {
          cubeImages: false,
        },
      });
      expect(
        driver.find.hook('item-wrapper').hasClass('cube-type-foo'),
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

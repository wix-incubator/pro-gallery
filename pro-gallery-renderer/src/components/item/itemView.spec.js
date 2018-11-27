//Yonatan Hattav Jun21
'use strict';

import VideoItem from './videos/videoItem.js';
import VideoItemPlaceholder from './videos/videoItemPlaceholder.js';
import CustomButton from './buttons/customButton.js';
import ItemTitle from './texts/itemTitle.js';
import {spy, expect, chai} from 'chai';
import sinon from 'sinon';
import utils from '../../../src/utils/index.js';
import React from 'react';
import GalleryDriver from '../../../test/drivers/reactDriver';
import {testImages} from '../../../test/images-mock';
import ItemView from './itemView';

describe('Item View', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;
  let mockEvent;
  beforeEach(() => {
    mockEvent = new Event('mock');
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
        loaded: false
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
      driver.get.instance().toggleShare({type: 'click', target: {tagName: 'button'}, relatedTarget: {tagName: 'button'}, stopPropagation: () => {}});
      expect(spy.called).to.be.true; //called on any event type other than mouseout
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({type: 'mouseout', target: {tagName: 'foo'}, relatedTarget: {tagName: 'button'}, stopPropagation: () => {}});
      expect(spy.called).to.be.false; //not called is mouseout but one of the tagName isnt listed
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({type: 'mouseout', target: {tagName: 'button'}, relatedTarget: {tagName: 'foo'}, stopPropagation: () => {}});
      expect(spy.called).to.be.false; //not called is mouseout but at least one of the tagName isnt listed
      spy.restore();
      spy = sinon.spy(ItemView.prototype, 'setState');
      driver.get.instance().toggleShare({type: 'mouseout', target: {tagName: 'foo'}, relatedTarget: {tagName: 'foo'}, stopPropagation: () => {}});
      expect(spy.called).to.be.true; // called if mouseout but no listed tagName
      spy.restore();
    });
    it('should changes showShare properly when fired', () => {
      driver.mount(ItemView, sampleItemViewProps);
      const spy = sinon.spy(ItemView.prototype, 'setState');
      driver.set.state({
        showShare: true
      });
      driver.get.instance().toggleShare({type: 'click', target: {tagName: 'button'}, relatedTarget: {tagName: 'button'}, stopPropagation: () => {}});
      expect(driver.get.state().showShare).to.be.false; //when forceVal is not sent - toggles showShare
      driver.get.instance().toggleShare({type: 'click', target: {tagName: 'button'}, relatedTarget: {tagName: 'button'}, stopPropagation: () => {}});
      expect(driver.get.state().showShare).to.be.true; //when forceVal is not sent - toggles showShare
      driver.get.instance().toggleShare({type: 'click', target: {tagName: 'button'}, relatedTarget: {tagName: 'button'}, stopPropagation: () => {}}, true);
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
  describe('onMouseOver', () => {
    it('should call onVideoHover when hovering and the type is video', () => {
      const spy = sinon.stub(ItemView.prototype, 'onVideoHover');
      Object.assign(sampleItemViewProps, {type: 'video'});
      driver.mount(ItemView, sampleItemViewProps);
      driver.find.hook('item-container').simulate('mouseover');
      expect(spy.called).to.be.true;
      spy.restore();
    });
    it('onVideoHover does not execute if played on mobile or if not defined as hover play', () => {
      Object.assign(sampleItemViewProps, {type: 'video'});
			//IMPORTANT stubing a function that is going to be passed as props before it is passed. stubing after mounting interfers with react managing the props and will not always work.
      const spy = sinon.stub(sampleItemViewProps, 'playVideo');
      driver.mount(ItemView, sampleItemViewProps);
      driver.set.props({styleParams: {videoPlay: 'hover'}});
      const stub = sinon.stub(utils, 'isMobile').returns(false);
      driver.find.hook('item-container').simulate('mouseover');
      expect(spy.called).to.be.true;
      stub.restore();
      spy.restore();
    });


  });
  describe('onItemClick', () => {
    it('should scroll to item on click if item is thumbnail and not if its not', () => {
      Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image'});
      driver.mount(ItemView, sampleItemViewProps);
      const spy = sinon.stub(driver.get.props().actions, 'scrollToItem');
      driver.find.hook('item-container').simulate('click');
      expect(spy.called).to.be.false;
      driver.set.props({thumbnailHighlightId: '1'});
      driver.find.hook('item-container').simulate('click');
      expect(spy.called).to.be.true;
      spy.restore();
    });
    it('should toggleFullscreen for items with link', () => {
      Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image', styleParams: {itemClick: 'link', videoPlay: 'onClick'}});
      driver.mount(ItemView, sampleItemViewProps);
      const stub = sinon.stub(driver.get.props().actions, 'toggleFullscreen');
      driver.find.hook('item-container').simulate('click');
      expect(stub.called).to.be.true;
      stub.restore();
    });
    it('should toggleFullscreen for items with expand', () => {
      Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'image', styleParams: {itemClick: 'expand', videoPlay: 'onClick'}});
      driver.mount(ItemView, sampleItemViewProps);
      const stub = sinon.stub(driver.get.props().actions, 'toggleFullscreen');
      driver.find.hook('item-container').simulate('click');
      expect(stub.called).to.be.true;
      stub.restore();
    });
    it('should toggle playVideo/pauseVideo for video items that are not expand and the video is styled to play onclick/the device is mobile/', () => {
      Object.assign(sampleItemViewProps, {thumbnailHighlightId: null, type: 'video', styleParams: {itemClick: 'foo', videoPlay: 'onClick'}});
      const spyPlay = sinon.stub(sampleItemViewProps, 'playVideo');
      const spyPause = sinon.stub(sampleItemViewProps, 'pauseVideo');
      driver.mount(ItemView, sampleItemViewProps);
      driver.set.props({
        playing: true
      });
      driver.find.hook('item-container').simulate('click');
      expect(spyPlay.called).to.be.false;
      expect(spyPause.called).to.be.true;
			// the props are toggled useing redux. to be tested in the e2e tests. here I hardcode a toggle for props.playing
      driver.set.props({
        playing: false
      });
      spyPlay.called = false;
      spyPause.called = false;
      driver.find.hook('item-container').simulate('click');
      expect(spyPlay.called).to.be.true;
      expect(spyPause.called).to.be.false;
      spyPlay.restore();
      spyPause.restore();
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
    it('should call toggleFullscreen only if the target item does not have block-fullscreen class', () => {
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
          cubeType: 'fit'},
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000}});
      driver.mount(ItemView, sampleItemViewProps);
			//IMPORTANT use deep when trying to compare objects
      expect(driver.get.instance().getImageDimensions()).to.deep.equal({});

      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'foo'},
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000}});
      expect(driver.get.instance().getImageDimensions()).to.deep.equal({});

      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'fit'},
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.92,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000}});
			//IMPORTANT notice marginTop is -0. if it was just 0 it wouldnt deep equal the -0 that returns from the function (the value is devided by -2 in the function)
      let testObject = {
        height: `calc(100% - 0px)`,
        marginTop: -0
      };
      expect(driver.get.instance().getImageDimensions()).to.deep.equal(testObject);
      driver.set.props({
        styleParams: {
          cubeImages: true,
          cubeType: 'fit'},
        style: {
          bgColor: 'none',
          maxWidth: 1920,
          maxHeight: 1000,
          ratio: 1.0,
          orientation: 'landscape',
          width: 1920,
          cubedWidth: 1920,
          height: 1000,
          cubedHeight: 1000}});
      testObject = {
        width: `calc(100% - 920px)`,
        marginLeft: 460
      };
      expect(driver.get.instance().getImageDimensions()).to.deep.equal(testObject);
    });
  });
  describe('isVisible', () => {
    it('should return true if the element is visible', () => {
      Object.assign(sampleItemViewProps, {
        documentHeight: 1080,
        scroll: {
          top: 200},
        type: 'video'});
      driver.mount(ItemView, sampleItemViewProps);
      let visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.false;
      driver.set.props({
        scroll: {
          top: 270}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.false;
      driver.set.props({
        scroll: {
          top: 271}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.true;
      driver.set.props({
        scroll: {
          top: 1349}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.true;
      driver.set.props({
        scroll: {
          top: 1350}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.false;
      driver.set.props({
        scroll: {
          top: 1500}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.false;
      driver.set.props({
        scroll: {
          top: 2000}
      });
      visible = driver.get.instance().isVisible(mockEvent, {top: 1200, bottom: 1500});
      expect(visible).to.be.false;
    });
  });
	// not testing all the "return component" functions
  describe('getItemInner', () => {
    it('should return a placeholder for non visible video', () => {
      Object.assign(sampleItemViewProps, {
        visible: true,
        styleParams: {
          isSlideshow: false},
        type: 'video'});
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(VideoItemPlaceholder).length).to.equal(0);
      expect(driver.find.selector(VideoItem).length).to.equal(1);
      driver.set.props({
        visible: false
      });
      expect(driver.find.selector(VideoItemPlaceholder).length).to.equal(1);
      expect(driver.find.selector(VideoItem).length).to.equal(0);
    });
    it('should create a separate div for buttons when in slideshow', () => {
      Object.assign(sampleItemViewProps, {
        visible: true,
        styleParams: {
          isSlideshow: true},
        type: 'image'});
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('gallery-item-info-buttons').length).to.equal(1);
      driver.set.props({
        styleParams: {
          isSlideshow: false}
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
          allowTitle: true},
        type: 'image'});
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(CustomButton).length).to.equal(1);
      expect(driver.find.selector(ItemTitle).length).to.equal(1);
    });

  });
	//compunentDidUpdate not tested
  describe('render', () => {
    it('should create a href only if itemClick is expand', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          itemClick: 'foo'}});
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector('div[href][data-hook="item-container"]').length).to.equal(0);
      driver.set.props({
        styleParams: {
          itemClick: 'expand'}});
      expect(driver.find.selector('div[href][data-hook="item-container"]').length).to.equal(1);
    });
    it('should have boxshadow only if defined', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          boxShadow: 5,
          imageMargin: 5}});
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-container').get(0).style;
      expect(style.boxShadow).to.equal('5px 5px 13px 0 rgba(0,0,0,0.2)');
      driver.set.props({
        styleParams: {
          boxShadow: 0,
          imageMargin: 5}});
      style = driver.find.hook('item-container').get(0).style;
      expect(style.boxShadow).to.equal('');
    });
    it('should toggle overflowY visible/inherit', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          isSlideshow: true}});
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-container').get(0).style;
      expect(style.overflowY).to.equal('visible');
      driver.set.props({
        styleParams: {
          isSlideshow: false}});
      style = driver.find.hook('item-container').get(0).style;
      expect(style.overflowY).to.equal('inherit');
    });
    it('item-Wrapper should have class based on cubeType', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: {
          cubeImages: true,
          cubeType: 'foo'}});
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('item-wrapper').hasClass('cube-type-foo')).to.equal(true);
      driver.set.props({
        styleParams: {
          cubeImages: false}});
      expect(driver.find.hook('item-wrapper').hasClass('cube-type-foo')).to.equal(false);
    });
    it('should toggle overflowY visible/inherit', () => {
      Object.assign(sampleItemViewProps, {
        style: {bgColor: 'red'},
        styleParams: {
          cubeType: 'fit'}});
      driver.mount(ItemView, sampleItemViewProps);
      let style = driver.find.hook('item-wrapper').get(0).style;
      expect(style.backgroundColor).to.equal('inherit');
      driver.set.props({
        styleParams: {
          cubeType: 'foot'}});
      style = driver.find.hook('item-wrapper').get(0).style;
      expect(style.backgroundColor).to.equal('red');
    });
  });
});




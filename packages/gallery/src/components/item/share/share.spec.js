//Yonatan Hattav 12 Jun 2018

import ItemView from '../itemView.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import Share from './share.js';
import { expect } from 'chai';
import sinon from 'sinon';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import utils from '../../../common/utils/index';
import EVENTS from '../../../common/constants/events';
import { viewModeWrapper } from '../../../common/window/viewModeWrapper';
import VIEW_MODE from '../../../common/constants/viewMode';

describe('Share:', () => {
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

  describe('a single sharing button', () => {
    it('calls eventsListener onClick', () => {
      const stub = sinon.stub(sampleItemViewProps.actions, 'eventsListener');
      driver.mount(Share, sampleItemViewProps);
      driver.find.hook('facebook-share-button').simulate('click', mockEvent);
      expect(stub.calledWith(EVENTS.SHARE_BUTTON_CLICKED)).to.be.true;
      stub.restore();
    });
    it('Toggles inactive based on isSiteMode() function (from viewModeWrapper)', () => {
      driver.mount(Share, sampleItemViewProps);
      expect(
        driver.find.hook('facebook-share-button').hasClass('inactive'),
      ).to.equal(false);
      viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
      driver.mount(Share, sampleItemViewProps);
      expect(
        driver.find.hook('facebook-share-button').hasClass('inactive'),
      ).to.equal(true);
      viewModeWrapper.setViewMode(VIEW_MODE.SITE);
    });
  });
  describe('Share component: ', () => {
    it('renders the root div when allowSocial is true', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: { allowSocial: true },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('social-share-box').length).to.equal(1);
    });
    it('does not render the root div when allowSocial is false', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: { allowSocial: false },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('social-share-box').length).to.equal(0);
    });
    it('Toggles classes based on props and state', () => {
      driver.mount(Share, sampleItemViewProps);
      driver.set.props({ showShare: false, isVerticalContainer: false });
      driver.set.state({ showShare: false });
      expect(driver.find.hook('social-share-box').hasClass('hidden')).to.equal(
        true,
      );
      expect(
        driver.find.hook('social-share-box').hasClass('vertical-item'),
      ).to.equal(false);
      expect(driver.find.hook('social-share-box').hasClass('hovered')).to.equal(
        false,
      );
      driver.set.props({ showShare: true, isVerticalContainer: true });
      driver.set.state({ showShare: true });
      expect(driver.find.hook('social-share-box').hasClass('hidden')).to.equal(
        false,
      );
      expect(
        driver.find.hook('social-share-box').hasClass('vertical-item'),
      ).to.equal(true);
      expect(driver.find.hook('social-share-box').hasClass('hovered')).to.equal(
        true,
      );
    });
    it('There are 5 children under Share box', () => {
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('social-share-box').children().length).to.equal(
        5,
      );
    });
    it('creates one share component per ItemView', () => {
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(Share).length).to.equal(1);
    });
    it('should have a correct transform formula', () => {
      Object.assign(sampleItemViewProps, {
        style: { height: 321, width: 123 },
        isVerticalContainer: false,
      });
      driver.mount(Share, sampleItemViewProps);
      let style = driver.find.hook('social-share-box').get(0).props.style;
      expect(style.transform).to.equal('translateX(-50%) scale(0.615)');
      driver.set.props({ isVerticalContainer: true });
      //driver.update();
      style = driver.find.hook('social-share-box').get(0).props.style;
      expect(style.transform).to.equal('translateY(-50%) ');
      driver.set.props({ style: { height: 123, width: 321 } });
      //driver.update();
      style = driver.find.hook('social-share-box').get(0).props.style;
      expect(style.transform).to.equal('translateY(-50%) scale(0.615)');
    });
  });

  describe('Share component on a text type item: ', () => {
    it('creates only 4 share buttons if the item type is text', () => {
      Object.assign(sampleItemViewProps, { type: 'text' });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('social-share-box').children().length).to.equal(
        4,
      );
    });
  });

  describe('Related functions: ', () => {
    it('calls handleKeyDown onKeyDown', () => {
      const spy = sinon.spy(Share.prototype, 'handleKeyDown');
      driver.mount(Share, sampleItemViewProps);
      driver.find.hook('social-share-box').simulate('keydown');
      expect(spy.called).to.be.true;
      spy.restore();
    });
    it('calls toggleShare onClick', () => {
      driver.mount(Share, sampleItemViewProps);
      const spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find.hook('social-share-box').simulate('click');
      expect(spy.called).to.be.true;
      spy.restore();
    });
    it('calls toggleShare onMouseOut', () => {
      driver.mount(Share, sampleItemViewProps);
      const spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find.hook('social-share-box').simulate('mouseout');
      expect(spy.called).to.be.true;
      spy.restore();
    });
    it('warns onmount if cannot focus on share icon', () => {
      const spy = sinon.stub(console, 'warn');
      const stubFocus = sinon.stub(HTMLElement.prototype, 'focus').throws();
      driver.mount(Share, sampleItemViewProps);
      driver.set.state({ focusedShareIcon: 1 });
      expect(spy.called).to.be.true;
      spy.restore();
      stubFocus.restore();
    });
    describe('handleKeyDown: ', () => {
      it('calls setStateAndLog for the "up" codes', () => {
        const spy = sinon.spy(utils, 'setStateAndLog');
        Object.assign(sampleItemViewProps, {
          showShare: true,
        });
        driver.mount(Share, sampleItemViewProps);
        driver.set.state({ showShare: true });
        driver.set.state({ focusedShareIcon: 2 });
        driver.get.instance().handleKeyDown({
          keyCode: null,
          charCode: 38,
          preventDefault() {},
          stopPropagation() {},
        });
        expect(spy.called).to.be.true;
        expect(driver.get.state().focusedShareIcon).to.equal(1);
        spy.restore();
      });
      it('calls setStateAndLog for the "down" codes', () => {
        const spy = sinon.spy(utils, 'setStateAndLog');
        Object.assign(sampleItemViewProps, {
          showShare: true,
        });
        driver.mount(Share, sampleItemViewProps);
        driver.set.state({ showShare: true });
        driver.set.state({ focusedShareIcon: 2 });
        driver.get.instance().handleKeyDown({
          keyCode: 40,
          charCode: null,
          preventDefault() {},
          stopPropagation() {},
        });
        expect(spy.called).to.be.true;
        expect(driver.get.state().focusedShareIcon).to.equal(3);
        spy.restore();
      });
      it('calls setStateAndLog for the "escape" codes', () => {
        const spy = sinon.spy(utils, 'setStateAndLog');
        Object.assign(sampleItemViewProps, {
          showShare: true,
        });
        driver.mount(Share, sampleItemViewProps);
        driver.set.state({ showShare: true });
        driver.set.state({ focusedShareIcon: 2 });
        driver.get.instance().handleKeyDown({
          keyCode: 27,
          charCode: null,
          preventDefault() {},
          stopPropagation() {},
        });
        expect(spy.called).to.be.true;
        expect(driver.get.state().focusedShareIcon).to.equal(0);
        spy.restore();
      });
      it('calls setStateAndLog for the "enter" codes while toggleing showShare', () => {
        const spy = sinon.spy(utils, 'setStateAndLog');

        //props.showShare = true && state.showShare = true
        Object.assign(sampleItemViewProps, {
          showShare: true,
        });
        driver.mount(Share, sampleItemViewProps);
        driver.set.state({ showShare: true });
        driver.set.state({ focusedShareIcon: 2 });
        driver.get.instance().handleKeyDown({
          keyCode: 32,
          charCode: null,
          preventDefault() {},
          stopPropagation() {},
        });
        expect(spy.called).to.be.true;
        expect(driver.get.state().focusedShareIcon).to.equal(0);

        //props.showShare = false && state.showShare = false
        Object.assign(sampleItemViewProps, {
          showShare: false,
        });
        driver.mount(Share, sampleItemViewProps);
        driver.get.instance().handleKeyDown({
          keyCode: 32,
          charCode: null,
          preventDefault() {},
          stopPropagation() {},
        });
        expect(driver.get.state().focusedShareIcon).to.equal(1);
        spy.restore();
      });
    });
  });
});

import GalleryDriver from '../../../__testsDrivers__/drivers/reactDriver';
import GalleryView from './galleryView';
import utils from '../../utils/index';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Gallery View', () => {
  let driver;
  let initialGalleryViewProps;
  let galleryViewProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialGalleryViewProps = driver.props.galleryView();
    Object.assign(initialGalleryViewProps.styleParams, {
      oneRow: false,
      styleParams: { imageMargin: 10, galleryMargin: 5 },
    });
  });

  describe(' init of different items ', () => {
    it('init one item gallery', () => {
      Object.assign(initialGalleryViewProps, {
        items: [initialGalleryViewProps.items[0]],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.hook('item-container').length).to.equal(1);
      expect(driver.find.selector('GalleryDebugMessage').length).to.equal(1);
    });

    it('init empty gallery', () => {
      Object.assign(initialGalleryViewProps, {
        items: [],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.hook('gallery-column').length).to.equal(0);
    });

    it('should create GalleryEmpty', () => {
      const stub = sinon.stub(utils, 'isEditor').returns(true);
      Object.assign(initialGalleryViewProps, {
        items: [],
        renderedItemsCount: -1,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.selector('GalleryEmpty').length).to.equal(1);
      stub.restore();
    });
  });

  describe('More Button tests ', () => {
    it('should hide load more button when infinte scroll enable', () => {
      Object.assign(initialGalleryViewProps, {
        galleryStructure: { height: 100 },
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      Object.assign(galleryViewProps, { displayShowMore: false });
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.hook('show-more').length).to.equal(0);
    });

    it('toggle to infiniteScroll mode when load more button is clicked', () => {
      const spy = sinon.spy(GalleryView.prototype, 'showMoreItems');
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      Object.assign(galleryViewProps, {
        displayShowMore: true,
        container: { height: 1000 },
      });
      driver.mount(GalleryView, galleryViewProps);
      const stub = sinon.stub(
        driver.get.props().actions,
        'toggleLoadMoreItems',
      );
      expect(driver.find.hook('show-more').length).to.equal(1);
      driver.find.hook('show-more').simulate('click');
      expect(spy.called).to.be.true;
      expect(stub.called).to.be.true;
      spy.restore();
      stub.restore();
    });
  });

  describe(' Arrow Keys handler tests ', () => {
    it('handle up arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon
        .stub(document.activeElement, 'getAttribute')
        .returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon
        .stub(driver.get.props().galleryStructure, 'findNeighborItem')
        .returns(3);
      const result = driver.get.instance().handleArrowKeys({
        keyCode: 38,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(stub_document.called).to.be.true;
      expect(stub_findNeighborItem.calledWith(7, 'up')).to.be.true;
      expect(result).to.be.false;
      stub_document.restore();
      stub_findNeighborItem.restore();
      stub_utils.restore();
    });

    it('handle left arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon
        .stub(document.activeElement, 'getAttribute')
        .returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon
        .stub(driver.get.props().galleryStructure, 'findNeighborItem')
        .returns(16);
      const result = driver.get.instance().handleArrowKeys({
        keyCode: 37,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(stub_document.called).to.be.true;
      expect(stub_findNeighborItem.calledWith(7, 'left')).to.be.true;
      expect(result).to.be.false;
      stub_document.restore();
      stub_findNeighborItem.restore();
      stub_utils.restore();
    });

    it('handle down arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon
        .stub(document.activeElement, 'getAttribute')
        .returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon
        .stub(driver.get.props().galleryStructure, 'findNeighborItem')
        .returns(10);
      const result = driver.get.instance().handleArrowKeys({
        keyCode: 40,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(stub_document.called).to.be.true;
      expect(stub_findNeighborItem.calledWith(7, 'down')).to.be.true;
      expect(result).to.be.false;
      stub_document.restore();
      stub_findNeighborItem.restore();
      stub_utils.restore();
    });

    it('handle right arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon
        .stub(document.activeElement, 'getAttribute')
        .returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon
        .stub(driver.get.props().galleryStructure, 'findNeighborItem')
        .returns(3);
      const result = driver.get.instance().handleArrowKeys({
        keyCode: null,
        charCode: 39,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(result).to.be.false;
      expect(stub_document.called).to.be.true;
      expect(stub_findNeighborItem.calledWith(7, 'right')).to.be.true;
      stub_document.restore();
      stub_findNeighborItem.restore();
      stub_utils.restore();
    });

    it('handle not valid arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon
        .stub(document.activeElement, 'getAttribute')
        .returns(7);
      const stub_findNeighborItem = sinon
        .stub(driver.get.props().galleryStructure, 'findNeighborItem')
        .returns(3);
      const result = driver.get.instance().handleArrowKeys({
        keyCode: null,
        charCode: 2,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(result).to.be.true;
      expect(stub_document.called).to.be.true;
      expect(stub_findNeighborItem.notCalled).to.be.true;
      stub_document.restore();
      stub_findNeighborItem.restore();
    });
  });
});

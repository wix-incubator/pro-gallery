import { utils, GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { expect } from 'chai';
import sinon from 'sinon';
import GalleryDriver from '../../drivers/reactDriver';
import GalleryView from '../../../src/components/gallery/proGallery/galleryView';

describe('Gallery View', () => {
  let driver;
  let initialGalleryViewProps;
  let galleryViewProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialGalleryViewProps = driver.props.galleryView();
    Object.assign(initialGalleryViewProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      options: {
        [optionsMap.layoutParams.structure.itemSpacing]: 10,
        [optionsMap.layoutParams.structure.gallerySpacing]: 5,
      },
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
      // expect(driver.find.hook('gallery-debug-message').length).to.equal(1);
    });

    it('init empty gallery', () => {
      Object.assign(initialGalleryViewProps, {
        items: [],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.hook('gallery-column').length).to.equal(0);
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
      const toggleLoadMoreItemsSpy = sinon.spy();
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      Object.assign(galleryViewProps, {
        displayShowMore: true,
        container: { ...galleryViewProps.container, height: 1000 },
        actions: {
          ...galleryViewProps.actions,
          toggleLoadMoreItems: toggleLoadMoreItemsSpy
        }
      });
      driver.mount(GalleryView, galleryViewProps);
      expect(driver.find.hook('show-more').length).to.equal(1);
      driver.trigger.click(driver.find.hook('show-more')[0])
      expect(spy.called).to.be.true;
      expect(toggleLoadMoreItemsSpy.called).to.be.true;
      spy.restore();
      toggleLoadMoreItemsSpy.restore();
    });
  });

  describe.only(' Arrow Keys handler tests ', () => {
    it.only('handle up arrow', () => {
      const findNeighborItemSpy = sinon.stub().returns(3);
      galleryViewProps = driver.props.galleryView(
        Object.assign(
        initialGalleryViewProps,
        {
          ...initialGalleryViewProps,
          galleryStructure: {
            ...initialGalleryViewProps.galleryStructure,
            findNeighborItem: findNeighborItemSpy,
          }
        }
      ));
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon.stub(document.activeElement, 'getAttribute').returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      // const stub_findNeighborItem = sinon.stub(driver.get.props().galleryStructure, 'findNeighborItem').returns(3);
      const result = driver.get.instance().handleKeys({
        keyCode: 38,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(stub_document.called).to.be.true;
      expect(findNeighborItemSpy.calledWith(7, 'up')).to.be.true;
      expect(result).to.be.false;
      stub_document.restore();
      stub_utils.restore();
    });

    it('handle left arrow', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(GalleryView, galleryViewProps);
      const stub_document = sinon.stub(document.activeElement, 'getAttribute').returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon.stub(driver.get.props().galleryStructure, 'findNeighborItem').returns(16);
      const result = driver.get.instance().handleKeys({
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
      const stub_document = sinon.stub(document.activeElement, 'getAttribute').returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon.stub(driver.get.props().galleryStructure, 'findNeighborItem').returns(10);
      const result = driver.get.instance().handleKeys({
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
      const stub_document = sinon.stub(document.activeElement, 'getAttribute').returns(7);
      const stub_utils = sinon.stub(utils, 'setStateAndLog');
      const stub_findNeighborItem = sinon.stub(driver.get.props().galleryStructure, 'findNeighborItem').returns(3);
      const result = driver.get.instance().handleKeys({
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
      const stub_document = sinon.stub(document.activeElement, 'getAttribute').returns(7);
      const stub_findNeighborItem = sinon.stub(driver.get.props().galleryStructure, 'findNeighborItem').returns(3);
      const result = driver.get.instance().handleKeys({
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

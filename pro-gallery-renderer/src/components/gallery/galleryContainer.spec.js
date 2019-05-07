import 'jsdom-global/register';
import GalleryDriver from '../../../__tests__/drivers/reactDriver';
import _ from 'lodash';
import { expect } from 'chai';

describe('Gallery Container', () => {
  let driver;

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  describe('toggle fullscreen', () => {
    let wrapper;
    const idx = 1;

    beforeEach(() => {
      const galleryContainerProps = driver.props.galleryContainer();
      driver.mount.galleryContainer(galleryContainerProps);

      wrapper = driver.wrapper;
      driver.get.instance().reRender('Items');
    });

    // TODO - this test breaks only in the CI - not sure why
    // it('Should open fullscreen if styleParams allow', () => {

    //   driver.set.state({
    //     styleParams: _.merge({}, driver.get.state().styleParams, {
    //       fullscreen: true,
    //       itemClick: 'expand'
    //     })
    //   });

    //   const timeBeforeFullscreen = Date.now() - 1;
    //   driver.get.instance().toggleFullscreen(idx);
    //   const fullscreenOpenTime = driver.get.instance().fullscreenOpenedAt;

    //   expect(timeBeforeFullscreen).to.be.below(fullscreenOpenTime);

    // });

    it('Should NOT open fullscreen if styleParams disallow', () => {
      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          fullscreen: true,
          itemClick: 'nothing',
        }),
      });

      const timeBeforeFullscreen = Date.now();
      driver.get.instance().toggleFullscreen(idx);
      const fullscreenOpenTime = driver.get.instance().fullscreenOpenedAt;

      expect(fullscreenOpenTime).to.be.undefined;
    });
  });

  describe('initial items load', () => {
    let wrapper;

    beforeEach(() => {
      const galleryContainerProps = driver.props.galleryContainer();
      galleryContainerProps.renderedItemsCount = 50;

      driver.mount.galleryContainer(galleryContainerProps);

      driver.wrapper.setState({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, driver.get.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000,
          },
        }),
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        }),
      });
    });

    it('should load only 50 items before scroll if items are large', () => {
      const renderedItemsCount = driver.get.state().renderedItemsCount;

      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gallerySize: 1000,
          gotStyleParams: true,
          enableInfiniteScroll: false,
        }),
      });

      driver.set.state({
        galleryStructure: driver.get
          .instance()
          .createGalleryStructure(driver.get.state()),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      const currentItems = driver.get.instance().currentItems().length;

      expect(renderedItemsCount).to.equal(currentItems);
    });

    it('should load only more items before scroll if items are small', () => {
      const renderedItemsCount = driver.get.state().renderedItemsCount;

      driver.wrapper.setState({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gallerySize: 10,
          minItemSize: 10,
          gotStyleParams: true,
          enableInfiniteScroll: false,
        }),
      });

      driver.wrapper.setState({
        driver: driver.get
          .instance()
          .createGalleryStructure(driver.get.state()),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      const currentItems = driver.get.instance().currentItems().length;

      expect(renderedItemsCount).to.be.below(currentItems);
    });
  });

  describe('Gallery layouts loads correctly', () => {
    let wrapper;
    let galleryContainerProps;

    beforeEach(() => {
      galleryContainerProps = driver.props.galleryContainer();
      galleryContainerProps.renderedItemsCount = 50;
      galleryContainerProps.styleParams =
        galleryContainerProps.styleParams || {};
    });

    it('Should be only one row should show nav arrows', () => {
      galleryContainerProps.styleParams.scrollDirection = 1;
      wrapper = driver.mount.galleryContainer(galleryContainerProps);

      expect(driver.get.state().styleParams.oneRow).to.equal(true);
      expect(driver.find.hook('nav-arrow-next').length).to.equal(1);
    });

    it('Cube type should be "fit" and cube ratio should be 1:1', () => {
      galleryContainerProps.styleParams.imageResize = 1;
      wrapper = driver.mount.galleryContainer(galleryContainerProps);

      expect(driver.get.state().styleParams.cubeType).to.equal('fit');
      expect(driver.get.state().styleParams.cubeRatio).to.equal(1);
    });

    it('Cube type should be "fit" and cube ratio should be 16:9 and cubeImages should be false when on "Slider" layout', () => {
      galleryContainerProps.styleParams.imageResize = 1;
      galleryContainerProps.styleParams.galleryLayout = 4;
      wrapper = driver.mount.galleryContainer(galleryContainerProps);

      expect(driver.get.state().styleParams.cubeType).to.equal('fit');
      expect(driver.get.state().styleParams.cubeRatio).to.equal(16 / 9);
      expect(driver.get.state().styleParams.cubeImages).to.equal(false);
    });
  });

  describe('infinite scroll', () => {
    let wrapper;

    beforeEach(() => {
      const galleryContainerProps = driver.props.galleryContainer();
      galleryContainerProps.renderedItemsCount = 50;

      wrapper = driver.mount.galleryContainer(galleryContainerProps);

      driver.set.state({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, driver.get.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000,
          },
        }),
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        }),
      });
    });

    it('should change height on scroll when infinite scroll is enabled', () => {
      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: true,
        }),
      });

      driver.set.state({
        galleryStructure: driver.get
          .instance()
          .createGalleryStructure(driver.get.state()),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      // console.debug('3) Layout height and last group: ', driver.get.instance().galleryStructure.height, driver.get.instance().galleryStructure.lastGroup.idx, driver.get.instance().galleryStructure.lastGroup.rendered, driver.get.instance().galleryStructure.lastGroup.width);
      // console.debug('3) Bounds are: ', driver.get.state().container.bounds);

      const initialHeight = driver.get.state().container.galleryHeight;
      const initialItems = driver.get.state().renderedItemsCount;

      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      // console.debug('4) Bounds are: ', driver.get.state().container.bounds);
      // console.debug('4) Layout height and last group: ', driver.get.instance().galleryStructure.height, driver.get.instance().galleryStructure.lastGroup.idx, driver.get.instance().galleryStructure.lastGroup.rendered, driver.get.instance().galleryStructure.lastGroup.width);

      const newHeight = driver.get.state().container.galleryHeight;
      const newItems = driver.get.state().renderedItemsCount;

      expect(newHeight).to.be.above(initialHeight);
      expect(newItems).to.be.above(initialItems);
    });

    it('should not change height on scroll if infinite scroll is disabled', () => {
      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: false,
        }),
      });

      driver.set.state({
        driver: driver.get
          .instance()
          .createGalleryStructure(driver.get.state()),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      const initialHeight = driver.get.state().container.galleryHeight;
      const initialItems = driver.get.state().renderedItemsCount;

      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });

      const newHeight = driver.get.state().container.galleryHeight;
      const newItems = driver.get.state().renderedItemsCount;

      expect(newHeight).to.equal(initialHeight);
      expect(newItems).to.equal(initialItems);
    });
  });

  describe('load more button', () => {
    beforeEach(() => {
      const galleryContainerProps = driver.props.galleryContainer();
      galleryContainerProps.renderedItemsCount = 50;

      driver.mount.galleryContainer(galleryContainerProps);

      driver.set.state({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, driver.get.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000,
          },
        }),
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        }),
      });
    });

    it('should start changing height on scroll when show more is clicked', () => {
      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: false,
        }),
        galleryStructure: driver.get
          .instance()
          .createGalleryStructure(driver.get.state()),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      const initialHeight = driver.get.state().container.galleryHeight;
      const initialItems = driver.get.state().renderedItemsCount;

      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });

      driver.get.instance().heightWasSetInternally = false;
      driver.get.instance().toggleInfiniteScroll();

      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });
      driver.get.instance().reRenderForScroll({
        customScrollTop: driver.get.instance().galleryStructure.height - 100,
      });

      const newHeight = driver.get.state().container.galleryHeight;
      const newItems = driver.get.state().renderedItemsCount;

      expect(newHeight).to.be.above(initialHeight);
      expect(newItems).to.be.above(initialItems);
    });

    // it('should show the showMore button if infinite scroll is disabled', () => {

    // driver.set.state({
    //   styles: _.merge({}, driver.get.state().styleParams, {
    //     gotStyleParams: true,
    //     enableInfiniteScroll: false,
    //   })
    // });

    //driver.get.instance().reRenderForScroll({customScrollTop: 0});

    //   expect(driver.find.hook('show-more').length).to.equal(1);

    // });

    it('should NOT show the showMore button if infinite scroll is enabled', () => {
      driver.set.state({
        styleParams: _.merge({}, driver.get.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: true,
        }),
      });

      driver.get.instance().reRenderForScroll({ customScrollTop: 0 });

      expect(driver.find.hook('show-more').length).to.equal(0);
    });
  });
});

import GalleryDriver from './galleryDriver.js';
import {shallow, mount} from 'enzyme';
import _ from 'lodash';
import React from 'react';
import {expect} from 'chai';
import {Wix} from 'photography-client-lib';

describe('Gallery Container', () => {

  let galleryDriver;

  beforeEach(() => {

    galleryDriver = new GalleryDriver();

  });

  describe('toggle fullscreen', () => {

    let wrapper;
    const idx = 1;

    beforeEach(() => {

      const galleryContainerProps = galleryDriver.create.galleryContainerProps();
      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      wrapper.instance().reRender('Items');

    });

    // TODO - this test breaks only in the CI - not sure why
    // it('Should open fullscreen if styleParams allow', () => {

    //   wrapper.setState({
    //     styleParams: _.merge({}, wrapper.state().styleParams, {
    //       fullscreen: true,
    //       itemClick: 'expand'
    //     })
    //   });

    //   const timeBeforeFullscreen = Date.now() - 1;
    //   wrapper.instance().toggleFullscreen(idx);
    //   const fullscreenOpenTime = wrapper.instance().fullscreenOpenedAt;

    //   expect(timeBeforeFullscreen).to.be.below(fullscreenOpenTime);

    // });

    it('Should NOT open fullscreen if styleParams disallow', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          fullscreen: true,
          itemClick: 'nothing'
        })
      });

      const timeBeforeFullscreen = Date.now();
      wrapper.instance().toggleFullscreen(idx);
      const fullscreenOpenTime = wrapper.instance().fullscreenOpenedAt;

      expect(fullscreenOpenTime).to.be.undefined;

    });

  });

  describe('initial items load', () => {

    let wrapper;

    beforeEach(() => {

      const galleryContainerProps = galleryDriver.create.galleryContainerProps();
      galleryContainerProps.renderedItemsCount = 50;

      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      wrapper.setState({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, wrapper.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000
          }
        }),
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        })
      });

    });

    it('should load only 50 items before scroll if items are large', () => {

      const renderedItemsCount = wrapper.state().renderedItemsCount;

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gallerySize: 1000,
          gotStyleParams: true,
          enableInfiniteScroll: false,
        })
      });

      wrapper.setState({
        galleryStructure: wrapper.instance().createGalleryStructure(wrapper.state())
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      const currentItems = wrapper.instance().currentItems().length;

      expect(renderedItemsCount).to.equal(currentItems);

    });

    it('should load only more items before scroll if items are small', () => {

      const renderedItemsCount = wrapper.state().renderedItemsCount;

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gallerySize: 10,
          minItemSize: 10,
          gotStyleParams: true,
          enableInfiniteScroll: false,
        })
      });

      wrapper.setState({
        galleryStructure: wrapper.instance().createGalleryStructure(wrapper.state())
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      const currentItems = wrapper.instance().currentItems().length;

      expect(renderedItemsCount).to.be.below(currentItems);

    });

  });

  describe('Gallery layouts loads correctly', () => {

    let wrapper;
    let galleryContainerProps;

    beforeEach(() => {
      galleryContainerProps = galleryDriver.create.galleryContainerProps();
      galleryContainerProps.renderedItemsCount = 50;
      galleryContainerProps.styleParams = galleryContainerProps.styleParams || {};
    });


    it('Should be only one row should show nav arrows', () => {
      galleryContainerProps.styleParams.scrollDirection = 1;
      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      expect(wrapper.state().styleParams.oneRow).to.equal(true);
      expect(wrapper.find({'data-hook': 'nav-arrow-next'}).length).to.equal(1);
    });

    it('Cube type should be "fit" and cube ratio should be 1:1', () => {
      galleryContainerProps.styleParams.imageResize = 1;
      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      expect(wrapper.state().styleParams.cubeType).to.equal('fit');
      expect(wrapper.state().styleParams.cubeRatio).to.equal(1);
    });

    it('Cube type should be "fit" and cube ratio should be 16:9 and cubeImages should be false when on "Slider" layout', () => {
      galleryContainerProps.styleParams.imageResize = 1;
      galleryContainerProps.styleParams.galleryLayout = 4;
      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      expect(wrapper.state().styleParams.cubeType).to.equal('fit');
      expect(wrapper.state().styleParams.cubeRatio).to.equal(16 / 9);
      expect(wrapper.state().styleParams.cubeImages).to.equal(false);
    });

  });

  describe('infinite scroll', () => {

    let wrapper;

    beforeEach(() => {

      const galleryContainerProps = galleryDriver.create.galleryContainerProps();
      galleryContainerProps.renderedItemsCount = 50;

      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      wrapper.setState({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, wrapper.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000
          }
        }),
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        })
      });

    });

    it('should change height on scroll when infinite scroll is enabled', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: true,
        })
      });

      wrapper.setState({
        galleryStructure: wrapper.instance().createGalleryStructure(wrapper.state())
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      // console.debug('3) Layout height and last group: ', wrapper.instance().galleryStructure.height, wrapper.instance().galleryStructure.lastGroup.idx, wrapper.instance().galleryStructure.lastGroup.rendered, wrapper.instance().galleryStructure.lastGroup.width);
      // console.debug('3) Bounds are: ', wrapper.state().container.bounds);

      const initialHeight = wrapper.state().container.galleryHeight;
      const initialItems = wrapper.state().renderedItemsCount;

      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      // console.debug('4) Bounds are: ', wrapper.state().container.bounds);
      // console.debug('4) Layout height and last group: ', wrapper.instance().galleryStructure.height, wrapper.instance().galleryStructure.lastGroup.idx, wrapper.instance().galleryStructure.lastGroup.rendered, wrapper.instance().galleryStructure.lastGroup.width);

      const newHeight = wrapper.state().container.galleryHeight;
      const newItems = wrapper.state().renderedItemsCount;

      expect(newHeight).to.be.above(initialHeight);
      expect(newItems).to.be.above(initialItems);

    });

    it('should not change height on scroll if infinite scroll is disabled', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: false,
        })
      });

      wrapper.setState({
        galleryStructure: wrapper.instance().createGalleryStructure(wrapper.state())
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      const initialHeight = wrapper.state().container.galleryHeight;
      const initialItems = wrapper.state().renderedItemsCount;

      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});

      const newHeight = wrapper.state().container.galleryHeight;
      const newItems = wrapper.state().renderedItemsCount;

      expect(newHeight).to.equal(initialHeight);
      expect(newItems).to.equal(initialItems);

    });

  });

  describe('load more button', () => {

    let wrapper;

    beforeEach(() => {

      const galleryContainerProps = galleryDriver.create.galleryContainerProps();
      galleryContainerProps.renderedItemsCount = 50;

      wrapper = galleryDriver.mount.galleryContainer(galleryContainerProps);

      wrapper.setState({
        gotScrollEvent: true,
        gotStyleParams: false,
        container: _.merge({}, wrapper.state().container, {
          galleryWidth: 1010,
          bounds: {
            visibleTop: 0,
            visibleBottom: 1000,
            renderedTop: 0,
            renderedBottom: 3000
          }
        }),
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gallerySize: 800,
          isVertical: true,
          groupSize: 1,
          cubeImages: true,
        })
      });

    });

    it('should start changing height on scroll when show more is clicked', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: false,
        })
      });

      wrapper.setState({
        galleryStructure: wrapper.instance().createGalleryStructure(wrapper.state())
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      const initialHeight = wrapper.state().container.galleryHeight;
      const initialItems = wrapper.state().renderedItemsCount;

      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});

      wrapper.instance().toggleInfiniteScroll();

      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});
      wrapper.instance().reRenderForScroll({customScrollTop: wrapper.instance().galleryStructure.height - 100});

      const newHeight = wrapper.state().container.galleryHeight;
      const newItems = wrapper.state().renderedItemsCount;

      expect(newHeight).to.be.above(initialHeight);
      expect(newItems).to.be.above(initialItems);

    });

    it('should show the showMore button if infinite scroll is disabled', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: false,
        })
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      expect(wrapper.find({'data-hook': 'show-more'}).length).to.equal(1);

    });

    it('should NOT show the showMore button if infinite scroll is enabled', () => {

      wrapper.setState({
        styleParams: _.merge({}, wrapper.state().styleParams, {
          gotStyleParams: true,
          enableInfiniteScroll: true,
        })
      });

      wrapper.instance().reRenderForScroll({customScrollTop: 0});

      expect(wrapper.find({'data-hook': 'show-more'}).length).to.equal(0);

    });
  });

});



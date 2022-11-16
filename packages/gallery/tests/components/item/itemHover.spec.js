import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import { use, expect } from 'chai';
import spies from 'chai-spies';
import sinon from 'sinon';
import GalleryDriver from '../../drivers/reactDriver';
import { testImages } from '../../drivers/mocks/images-mock';
import ItemHover from '../../../src/components/item/itemHover';
import { optionsMap } from 'pro-gallery-lib';

use(spies);

describe('ItemHover', () => {
  let driver;
  let sampleItem;
  let sampleItemViewProps;
  let stub;

  function itemHoverHasClass(_driver, className) {
    return expect(_driver.find.hook('item-hover-1').hasClass(className));
  }

  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps, {
      idx: 1,
      imageDimensions: {
        height: 200,
        marginTop: 10,
        width: 200,
      },
      actions: {
        handleItemMouseDown: () => {},
        handleItemMouseUp: () => {},
      },
      forceShowHover: true,
      itemType: 'image',
    });
  });

  it('should rendered hover inner only when needed appreas, not hovered', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: false,
      renderCustomInfo: undefined,
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(0);
  });
  it('should rendered hover inner only when needed appreas, hovered', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: true,
      renderCustomInfo: undefined,
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(0);
  });
  it('should rendered hover inner only when needed appreas, not hovered with custom', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: false,
      renderCustomInfo: () => {},
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(0);
  });
  it('should rendered hover inner only when needed dissapears, not hovered', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: false,
      renderCustomInfo: () => {},
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].DISAPPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(1);
  });
  it('should rendered hover inner only when needed, dissapears, not hovered, no effect', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: false,
      renderCustomInfo: () => {},
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].DISAPPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .NO_EFFECT,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(1);
  });
  it('should rendered hover inner only when needed appears hovered slideup wiht custom info', () => {
    Object.assign(sampleItemViewProps, {
      itemWasHovered: true,
      renderCustomInfo: () => {},
    });
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].APPEARS,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    expect(driver.find.class('gallery-item-hover-inner').length).to.equal(1);
  });

  it('className should be correct', () => {
    //-------| item type |-------

    Object.assign(sampleItemViewProps, {
      itemType: 'video',
    });
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'gallery-item-hover').to.equal(true);

    Object.assign(sampleItemViewProps, {
      itemType: 'image',
    });
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'gallery-item-hover').to.equal(true);

    //-------| fullscreen |-------

    Object.assign(sampleItemViewProps.options, {
      fullscreen: true,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'fullscreen-enabled').to.equal(true);

    Object.assign(sampleItemViewProps.options, {
      fullscreen: false,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'fullscreen-disabled').to.equal(true);

    //-------| opacity |-------

    //options.itemOpacity is undefined
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'default').to.equal(true);

    Object.assign(sampleItemViewProps.options, {
      itemOpacity: 0,
    });
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'default').to.equal(false);

    //-------| forceShowHover & isMobile |-------

    Object.assign(sampleItemViewProps, {
      forceShowHover: true,
    });
    stub = sinon.stub(utils, 'isMobile').returns(true);
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'force-hover').to.equal(true);
    itemHoverHasClass(driver, 'hide-hover').to.equal(false);
    stub.restore();

    Object.assign(sampleItemViewProps, {
      forceShowHover: false,
    });
    stub = sinon.stub(utils, 'isMobile').returns(true);
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'force-hover').to.equal(false);
    itemHoverHasClass(driver, 'hide-hover').to.equal(true);
    stub.restore();

    Object.assign(sampleItemViewProps, {
      forceShowHover: false,
    });
    stub = sinon.stub(utils, 'isMobile').returns(false);
    driver.mount(ItemHover, sampleItemViewProps);
    itemHoverHasClass(driver, 'force-hover').to.equal(false);
    itemHoverHasClass(driver, 'hide-hover').to.equal(false);
    stub.restore();
  });
});

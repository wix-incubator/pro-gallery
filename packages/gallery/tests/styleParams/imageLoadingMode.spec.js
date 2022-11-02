import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import sinon from 'sinon';
import { testImages } from '../drivers/mocks/images-mock';
import ItemView from '../../src/components/item/itemView';

describe('options - imageLoadingMode', () => {
  let driver;

  function getSampleItemViewProps(changeingOptions, createUrlStub = () => {}) {
    driver = new GalleryDriver();
    const sampleItem = testImages[0];
    const sampleItemViewProps = driver.props.itemView(sampleItem);
    return Object.assign(sampleItemViewProps, {
      gotFirstScrollEvent: true,
      options: {
        ...sampleItemViewProps.options,
        ...changeingOptions,
      },
      createUrl: createUrlStub,
    });
  }

  async function mountAndUpdate(props) {
    driver.mount(ItemView, props);
    await driver.update();
  }

  it('should preload blury image', async () => {
    const createUrlStub = sinon.stub();
    const props = getSampleItemViewProps(
      {
        [optionsMap.behaviourParams.item.content.loader]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].BLUR,
      },
      createUrlStub
    );
    await mountAndUpdate(props);
    expect(createUrlStub.withArgs('resized', 'thumb').called).to.be.true;
  });
  it('should preload pixel image (MAIN_COLOR)', async () => {
    const createUrlStub = sinon.stub();
    const props = getSampleItemViewProps(
      {
        [optionsMap.behaviourParams.item.content.loader]:
          GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader]
            .MAIN_COLOR,
      },
      createUrlStub
    );
    await mountAndUpdate(props);
    expect(createUrlStub.withArgs('pixel', 'img').called).to.be.true;
  });
  it('should preload color background (COLOR)', async () => {
    const props = getSampleItemViewProps({
      [optionsMap.behaviourParams.item.content.loader]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].COLOR,
    });
    await mountAndUpdate(props);
    const item = driver.find.selector('.load-with-color').length;
    expect(item).to.be.equal(1);
  });
});

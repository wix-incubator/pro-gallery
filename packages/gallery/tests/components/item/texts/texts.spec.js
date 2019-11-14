import { use, expect } from 'chai';
import spies from 'chai-spies';
import GalleryDriver from '../../../drivers/reactDriver.js';
import { testImages } from '../../../drivers/mocks/images-mock';
import sinon from 'sinon';
import Texts from '../../../../src/components/item/texts/texts.js';
import lineHeightFixer from '../../../../src/components/item/texts/lineHeightFixer';

use(spies);

describe('Text elements', () => {
  let itemViewProps;
  let galleryDriver;
  let sampleItem;
  let galleryConfig;
  beforeEach(() => {
    galleryDriver = new GalleryDriver();
    galleryConfig = galleryDriver.get.galleryConfig;
    sampleItem = testImages[0];
    itemViewProps = galleryDriver.props.itemView(sampleItem, galleryConfig);
    itemViewProps.shouldShowButton = true;
    itemViewProps.styleParams.allowTitle = true;
    itemViewProps.styleParams.allowDescription = true;
    itemViewProps.isSmallItem = false;
    itemViewProps.description = 'description';
  });

  it('shoud render title, description and button', () => {
    galleryDriver.mount(Texts, itemViewProps);
    expect(galleryDriver.find.hook('item-title').length).to.equal(1);
    expect(galleryDriver.find.hook('item-description').length).to.equal(1);
    expect(galleryDriver.find.hook('custom-button-button').length).to.equal(1);
  });

  it('shold hide item texts', () => {
    // sets shouldShowTitle and shouldShowDescription to false
    itemViewProps.isSmallItem = true;
    // sets shouldHaveBottomSpaceInTitle to false
    itemViewProps.shouldShowButton = false;
    itemViewProps.styleParams.allowTitle = false;
    itemViewProps.styleParams.allowDescription = false;
    galleryDriver.mount(Texts, itemViewProps);
    expect(galleryDriver.find.hook('item-title').length).to.equal(0);
    expect(galleryDriver.find.hook('item-description').length).to.equal(0);
    expect(galleryDriver.find.hook('custom-button-button').length).to.equal(0);
  });

  it('should call lineHeightFixer', () => {
    const spy = sinon.spy(lineHeightFixer, 'fix');
    galleryDriver.mount(Texts, itemViewProps);
    expect(spy.called).to.be.true;
  });

  it('should set title margin bottom to 0', () => {
    itemViewProps.description = '';
    itemViewProps.shouldShowButton = false;
    // make allowAnyAction() return false;
    itemViewProps.styleParams.loveButton = itemViewProps.styleParams.allowSocial = itemViewProps.styleParams.allowDownload = false;
    galleryDriver.mount(Texts, itemViewProps);
    expect(
      galleryDriver.find.hook('item-title').get(0).props.style.marginBottom,
    ).to.equal(0);
  });
});

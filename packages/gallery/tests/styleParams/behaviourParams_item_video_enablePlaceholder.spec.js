import GalleryDriver from '../drivers/reactDriver';
import { testVideos } from '../drivers/mocks/images-mock';
import VideoItemWrapper from '../../src/components/item/videos/videoItemWrapper';
import { expect } from 'chai';
import { optionsMap } from 'pro-gallery-lib';

const mountAndGetPreloadElements = (driver, sampleItemProps) => {
  driver.mount(VideoItemWrapper, sampleItemProps);
  return driver.find.selector('.gallery-item-video.image-item');
};

describe('options - behaviourParams_item_video_enablePlaceholder ', () => {
  let driver;
  let sampleItem;
  let sampleItemViewProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    sampleItem = testVideos[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    Object.assign(sampleItemViewProps, {
      playing: false,
      onMount: () => {},
      onUnmount: () => {},
      loadingStatus: {},
      imageDimensions: {},
    });
  });

  it('should not remove video placeholder when "behaviourParams_item_video_enablePlaceholder=true"', async () => {
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.video.enablePlaceholder]: true,
    });
    const placeholders = mountAndGetPreloadElements(driver, sampleItemViewProps);
    expect(placeholders.length).to.equal(1);
  });
  it('should not remove video placeholder when "behaviourParams_item_video_enablePlaceholder=false"', async () => {
    Object.assign(sampleItemViewProps.options, {
      [optionsMap.behaviourParams.item.video.enablePlaceholder]: false,
    });
    const placeholders = mountAndGetPreloadElements(driver, sampleItemViewProps);
    expect(placeholders.length).to.equal(0);
  });
});

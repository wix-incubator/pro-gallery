import GalleryDriver from '../drivers/reactDriver';
import { testVideos } from '../drivers/mocks/images-mock';
import VideoItemWrapper from '../../src/components/item/videos/videoItemWrapper';
import { expect } from 'chai';

const mountAndGetPreloadElements = (driver, sampleItemProps) => {
  driver.mount(VideoItemWrapper, sampleItemProps);
  return driver.find.selector('.gallery-item-video.image-item');
};

describe('Video Item ', () => {
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

  it('should remove video placeholder when "removeVideoPlaceholder=true"', async () => {
    Object.assign(sampleItemViewProps.styleParams, {
      removeVideoPlaceholder: true,
    });
    const placeholders = mountAndGetPreloadElements(
      driver,
      sampleItemViewProps
    );
    expect(placeholders.length).to.equal(0);
  });
  it('should not remove video placeholder when "removeVideoPlaceholder=false"', async () => {
    Object.assign(sampleItemViewProps.styleParams, {
      removeVideoPlaceholder: false,
    });
    const placeholders = mountAndGetPreloadElements(
      driver,
      sampleItemViewProps
    );
    expect(placeholders.length).to.equal(1);
  });
});

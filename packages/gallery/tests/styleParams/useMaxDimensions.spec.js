import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { itemsWithDirectShareLink } from '../drivers/mocks/items';
import ItemView from '../../src/components/item/itemView';

describe('styleParam - useMaxDimensions', () => {
  let driver;

  function getSampleItemViewProps(styleParams) {
    driver = new GalleryDriver();
    const sampleItem = itemsWithDirectShareLink[0];
    const sampleItemViewProps = driver.props.itemView(sampleItem);
    return Object.assign(sampleItemViewProps, {
      styleParams,
      style: {
        maxWidth: 100,
        maxHeight: 100,
        ratio: 1,
        orientation: 'landscape',
        width: 1000,
        cubedWidth: 1000,
        height: 1000,
        cubedHeight: 1000,
      },
      requiredRatio: 1,
    });
  }

  async function mountUpdateAndItemStyle(sample) {
    driver.mount(ItemView, sample);
    await driver.update();
    const style = driver.find.hook('item-wrapper').props().style;
    return style;
  }
  it('should use original dimensions (maxHeight and maxWidth)', async () => {
    const sample = getSampleItemViewProps({
      useMaxDimensions: true,
    });
    const styles = await mountUpdateAndItemStyle(sample);
    expect(styles).to.include({ width: 100, height: 100 });
  });
  it('should not use original dimensions (maxHeight and maxWidth)', async () => {
    const sample = getSampleItemViewProps({
      useMaxDimensions: false,
    });
    const styles = await mountUpdateAndItemStyle(sample);
    expect(styles).to.include({ width: 1000, height: 1000 });
  });
});

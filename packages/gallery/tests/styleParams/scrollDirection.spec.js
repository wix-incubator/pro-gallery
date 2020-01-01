import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - loveButton', () => {

  let driver;
  const initialProps = {
    container: {
      height: 600,
      width:600,
      scrollBase: 0
    },
    items: [...images2, ...images2],
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render element "#gallery-horizontal-scroll" when "scrollDirection" is "1"', () => {
    Object.assign(initialProps.styles, {
      scrollDirection:1,
      galleryLayout:2
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('.gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1)
    driver.detach.proGallery();
  });
  it('should not render element "#gallery-horizontal-scroll" when "scrollDirection" is "0"', () => {
    Object.assign(initialProps.styles, {
      scrollDirection:0,
      galleryLayout:2
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('.gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(0)
    driver.detach.proGallery();
  });
  it('should render navigation arrows when "scrollDirection" is "1"', () => {
    Object.assign(initialProps.styles, {
      scrollDirection:1,
      galleryLayout:2,
    });
    driver.mount.proGallery(initialProps);
    const arrows = driver.find.selector('.nav-arrows-container');
    const elem = driver.find.selector('#pro-gallery-container');
    const width = getComputedStyle(elem.getDOMNode()).width;
    console.log(elem.html());
    
    console.log(arrows.length, window.innerWidth, width);
    
    expect()
    driver.detach.proGallery();
  })
})
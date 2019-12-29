import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams } from '../drivers/mocks/styles'

describe('styleParam - enableInfiniteScroll', () => {

  let driver;
  const initialProps = {
    container:{
      height:600,
      width:600,
      scrollBase:0
    },
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render "Show More" button when "enableInfiniteScroll" is "false"', () => {
    // make sure to give the right params to make a vertical gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      scrollDirection:0,
      enableInfiniteScroll:false
    })
    driver.mount.proGallery(initialProps);
    const showMoreBtn = driver.find.hook('show-more');
    //expect to have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(1)
    driver.detach.proGallery();
  });
  it('should not render "Show More" button when "enableInfiniteScroll" is "true"', () => {
    // make sure to give the right params to make a vertical gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      scrollDirection:0,
      enableInfiniteScroll:true
    })
    driver.mount.proGallery(initialProps);
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0)
    driver.detach.proGallery();
  });
  it('should not render "Show More" button in a "oneRow" gallery when "enableInfiniteScroll" is false', () => {
    // make sure to give the right params to make a horizontal gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      scrollDirection:1,
      enableInfiniteScroll:false
    })
    driver.mount.proGallery(initialProps);
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

})
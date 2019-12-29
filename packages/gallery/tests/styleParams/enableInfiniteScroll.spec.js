import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams } from '../drivers/mocks/styles'
import { getElementDimensions } from '../utils/utils'

describe('styleParam - enableInfiniteScroll', () => {

  let driver;
  const initialProps = {
    container:{
      height:600,
      width:600,
      scrollBase:0
    },
    items: [...images2, ...images2],
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
      oneRow:true,
      scrollDirection:1,
      enableInfiniteScroll:false
    })
    driver.mount.proGallery(initialProps);
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

  it('should grow verticaly if "enableInfiniteScroll" is "false" only after clicking "Load More" (vertical gallery)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      scrollDirection:0,
      enableInfiniteScroll:false,
      loadMoreAmount:'all'
    })
    driver.mount.proGallery(initialProps);
    let gallery = driver.find.selector('#pro-gallery-container');
    // get initial gallery height before load more click
    const initialGalleryHeight = getElementDimensions(gallery).height
    
    // simulate click to see if gallery height is updated
    const showMoreBtn = driver.find.hook('show-more');
    showMoreBtn.simulate('click');
    gallery = driver.find.selector('#pro-gallery-container');
    const finalHeight = getElementDimensions(gallery).height;
    // expect the gallery to update the hight after Load More click
    expect(finalHeight).to.be.greaterThan(initialGalleryHeight)
    driver.detach.proGallery();
  });

  it('should grow verticaly initialy when "enableInfiniteScroll" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      scrollDirection:0,
      enableInfiniteScroll:true,
      loadMoreAmount:'all'
    })
    driver.mount.proGallery(initialProps);
    const showMoreBtn = driver.find.hook('show-more');
    // expect to not find a "Show More" button (indicates that the gallery is displaying all items)
    expect(showMoreBtn).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

})
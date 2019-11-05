import GalleryDriverNew from '../galleryDriverNew/galleryDriver';
import { expect } from 'chai';
import { images } from '../../constants/items';
import { styleParams, container } from '../../constants/styles';

describe('styleParam - numberOfImagesPerCol', () => {

    let driver;
    const initialProps = {
        container,
        items: images,
        styles: styleParams
    }

    beforeEach(() => {
        driver = new GalleryDriverNew();
        Object.assign(initialProps.styles, {
            oneRow: false,
            scrollDirection: 0,
            numberOfImagesPerRow: 1,
            gridStyle: 1
        })
    });

    afterEach(() => {
        driver.detachGallery();
    })

    it('should set gallery as non slider vertical gallery', () => {
        driver.mountGallery(initialProps)
        const galleryElem = driver.find().selector('#pro-gallery-container');
        expect(galleryElem.hasClass('pro-gallery inline-styles ')).to.be.true;
    });

    it('should render 2 images per row', () => {
        Object.assign(initialProps.styles, {
            numberOfImagesPerRow: 2
        });
        driver.mountGallery(initialProps)
        const items = driver.find().hook('data-hook', 'item-container');
        const list = items.filterWhere(item => getComputedStyle(item.getDOMNode()).top === '0px')
        expect(list.length).to.eq(2);
    });

    it('should render 3 images per row', () => {
        Object.assign(initialProps.styles, {
            numberOfImagesPerRow: 3
        });
        driver.mountGallery(initialProps);
        const items = driver.find().hook('data-hook', 'item-container');
        const list = items.filterWhere(item => getComputedStyle(item.getDOMNode()).top === '0px')
        expect(list.length).to.eq(3);
    })
})
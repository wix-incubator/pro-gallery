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
            galleryLayout: 1,
            oneRow: false,
            scrollDirection: 0,
            numberOfImagesPerCol: 1
        })
    });

    afterEach(() => {
        driver.detachGallery();
    })

    it('should set gallery as oneRow slider gallery', () => {
        Object.assign(initialProps.styles, {
            galleryLayout: 2,
            oneRow: true,
            scrollDirection: 1,
            numberOfImagesPerCol: 1
        })
        driver.mountGallery(initialProps)
        const galleryElem = driver.find().selector('#pro-gallery-container');
        expect(galleryElem.hasClass('pro-gallery inline-styles one-row hide-scrollbars  slider ')).to.be.true;
    });

    it('should render 1 images per col', () => {
        Object.assign(initialProps.styles, {
            galleryLayout: 2,
            oneRow: true,
            scrollDirection: 1,
            numberOfImagesPerCol: 1
        })
        driver.mountGallery(initialProps)
        const items = driver.find().hook('data-hook', 'item-container');
        const list = items.filterWhere(item => getComputedStyle(item.getDOMNode()).left === '0px')
        expect(list.length).to.eq(1);
    });

    it('should render 2 images per col', () => {
        Object.assign(initialProps.styles, {
            galleryLayout: 2,
            oneRow: true,
            scrollDirection: 1,
            numberOfImagesPerCol: 2
        });
        driver.mountGallery(initialProps)
        const items = driver.find().hook('data-hook', 'item-container');
        const list = items.filterWhere(item => getComputedStyle(item.getDOMNode()).left === '0px')
        expect(list.length).to.eq(2);
    });

    it('should render 3 images per col', () => {

        Object.assign(initialProps.styles, {
            numberOfImagesPerCol: 3,
            galleryLayout: 2,
            oneRow: true,
        });
        driver.mountGallery(initialProps);
        driver.find().hook('data-hook', 'group-view').forEach((item) => {
            expect(item.children().length).to.eq(3)// the gallery will render extra, empty item-containers to fill the short columns
        });
    })
})
import GalleryDriverNew from './galleryDriverNew/galleryDriver';
import { expect } from 'chai';
import { images2, videoItems } from '../constants/items';
import { styleParams, container } from '../constants/styles';


describe('styleParam - itemClick', () => {

    let driver;
    const initialProps = {
        container,
        items: images2,
        styles: styleParams
    }

    beforeEach(() => {
        driver = new GalleryDriverNew();
    });

    describe('should set the correct role for each "itemClick" value', () => {

        it('expect "role" to be "link" when "itemClick" is "link"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.props().role).to.eq('link');
            driver.detachGallery();
        })
        it('expect "role" to be "button" when "itemClick" is "expand"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mountGallery(initialProps)
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.props().role).to.eq('button');
            driver.detachGallery();
        })
        it('expect "role" to be "button" when "itemClick" is "fullscreen"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
            });
            driver.mountGallery(initialProps)
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.props().role).to.eq('button');
            driver.detachGallery();
        })
        it('expect "role" to be "" when "itemClick" is "nothing"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
            });
            driver.mountGallery(initialProps)
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.props().role).to.eq('');
            driver.detachGallery();
        })
    })

    describe('should set className "clickable" when "itemClick" is "expand/fullscreen/link"', () => {
        it('expect item to have className "clickable" when "itemClick" is "link"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detachGallery();
        })
        it('expect item to have className "clickable" when "itemClick" is "expand"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detachGallery();
        })
        it('expect item to have className "clickable" when "itemClick" is "fullscreen"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detachGallery();
        })
        it('expect item to not have className "clickable" when "itemClick" is "nothing"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(3);
            expect(item.hasClass('clickable')).to.be.false;
            driver.detachGallery();
        })
    })

    describe('should set href link only when "itemClick" is set to "link"', () => {
        it('check href when itemClick = link', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().selector('#pro-gallery-container a').at(0);
            expect(item.props().href).to.not.be.undefined;
            driver.detachGallery();
        })
        it('check href when itemClick = expand', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mountGallery(initialProps);
            const item = driver.find().selector('#pro-gallery-container a').at(0);
            expect(item.props().href).to.be.undefined;
            driver.detachGallery();
        })
    })

    describe('should not play video onClick in gallery when "itemClick" is "expand/fullscreen" and "videoPlay" is "onClick"', () => {
        it('expect to find video element', () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
                videoPlay: 'onClick'
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(0);
            item.simulate('click');
            expect(driver.find().hook('data-hook', 'video_container-video-player-element').length).to.eq(1);
            driver.detachGallery();
        })
        it('expect not to find video element when "itemClick" is "expand"', () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
                videoPlay: 'onClick'
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(0);
            item.simulate('click');
            expect(driver.find().hook('data-hook', 'video_container-video-player-element').length).to.eq(0);
            driver.detachGallery();
        })
        it('expect not to find video element when "itemClick" is "fullscreen"', () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
                videoPlay: 'onClick'
            });
            driver.mountGallery(initialProps);
            const item = driver.find().hook('data-hook', 'item-container').at(0);
            item.simulate('click');
            expect(driver.find().hook('data-hook', 'video_container-video-player-element').length).to.eq(0);

            driver.detachGallery();
        })
    })

    describe('should not play video onClick in gallery when video item has "href" link', () => {


        it('expect video with link to not play in the gallery', () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'link',
                videoPlay: 'onClick'
            });
            driver.mountGallery(initialProps);
            // video item with link
            const linkVideo = driver.find().hook('data-hook', 'item-container').at(0);
            linkVideo.simulate('click');
            expect(driver.find().hook('data-hook', 'video_container-video-player-element').length).to.eq(0);
            driver.detachGallery();
        })
        it('expect video without link to play in the gallery', () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'link',
                videoPlay: 'onClick'
            });
            driver.mountGallery(initialProps);
            // video item with link
            const noLinkVideo = driver.find().hook('data-hook', 'item-container').at(1);
            noLinkVideo.simulate('click');
            expect(driver.find().hook('data-hook', 'video_container-video-player-element').length).to.eq(1)
            driver.detachGallery();
        })
    })
})
import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2, videoItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';


describe('styleParam - itemClick', () => {

    //let driver;
    const initialProps = {
        container,
        items: images2,
        styles: styleParams
    };

    beforeEach(() => {
        driver = new GalleryDriver();
    });

    describe('should set the correct role for each "itemClick" value', () => {
        it('expect "role" to be "link" when "itemClick" is "link"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.props().role).to.eq('link');
            driver.detach.proGallery();
        });
        it('expect "role" to be "button" when "itemClick" is "expand"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mount.proGallery(initialProps)
            const item = driver.find.hook('item-container').at(3);
            expect(item.props().role).to.eq('button');
            driver.detach.proGallery();
        });
        it('expect "role" to be "button" when "itemClick" is "fullscreen"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.props().role).to.eq('button');
            driver.detach.proGallery();
        });
        it('expect "role" to be "" when "itemClick" is "nothing"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.props().role).to.eq('');
            driver.detach.proGallery();
        })
    });

    describe('should set className "clickable" when "itemClick" is "expand/fullscreen/link"', () => {
        it('expect item to have className "clickable" when "itemClick" is "link"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detach.proGallery();
        });
        it('expect item to have className "clickable" when "itemClick" is "expand"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detach.proGallery();
        });
        it('expect item to have className "clickable" when "itemClick" is "fullscreen"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.hasClass('clickable')).to.be.true;
            driver.detach.proGallery();
        });
        it('expect item to not have className "clickable" when "itemClick" is "nothing"', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.hook('item-container').at(3);
            expect(item.hasClass('clickable')).to.be.false;
            driver.detach.proGallery();
        })
    });

    describe('should set href link only when "itemClick" is set to "link"', () => {
        it('check href when itemClick = link', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'link',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.selector('#pro-gallery-container a').at(0);
            expect(item.props().href).to.not.be.undefined;
            driver.detach.proGallery();
        });
        it('check href when itemClick = expand', () => {
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
            });
            driver.mount.proGallery(initialProps);
            const item = driver.find.selector('#pro-gallery-container a').at(0);
            expect(item.props().href).to.be.undefined;
            driver.detach.proGallery();
        })
    });

    describe('should play video onClick in gallery only when itemClick is nothing and videoPlay is onClick', () => {
        it('expect to find video element', async () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'nothing',
                videoPlay: 'onClick'
            });
            driver.mount.proGallery(initialProps);    
            await driver.update(100);        
            const item = driver.find.hook('item-wrapper').at(0);
            item.simulate('click');
            await driver.update(100);
            expect(driver.find.hook('video_container-video-player-element').length).to.eq(1);
            driver.detach.proGallery();
        });
        it('expect not to find video element when "itemClick" is "expand"', async () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'expand',
                videoPlay: 'onClick'
            });
            driver.mount.proGallery(initialProps);
            await driver.update(100);
            const item = driver.find.hook('item-wrapper').at(0);
            item.simulate('click');
            expect(driver.find.hook('video_container-video-player-element').length).to.eq(0);
            driver.detach.proGallery();
        });
        it('expect not to find video element when "itemClick" is "fullscreen"', async () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'fullscreen',
                videoPlay: 'onClick'
            });
            driver.mount.proGallery(initialProps);
            await driver.update(100);
            const item = driver.find.hook('item-wrapper').at(0);
            item.simulate('click');
            expect(driver.find.hook('video_container-video-player-element').length).to.eq(0);

            driver.detach.proGallery();
        });
        it('expect not to find video element when "itemClick" is "link"', async () => {
            Object.assign(initialProps, {
                items: videoItems
            });
            Object.assign(initialProps.styles, {
                itemClick: 'link',
                videoPlay: 'onClick'
            });
            driver.mount.proGallery(initialProps);
            await driver.update(100);
            const item = driver.find.hook('item-wrapper').at(0);
            item.simulate('click');
            expect(driver.find.hook('video_container-video-player-element').length).to.eq(0);

            driver.detach.proGallery();
        })
    });
});

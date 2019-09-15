
import React from 'react';
import ProGallery from 'pro-gallery/dist/src/components/gallery/proGallery';
import {testItems} from './images';
import { resizeMediaUrl } from './itemResizer';

export default class Gallery extends React.Component {

	render() {

		// Add your images here...
		const items = testItems;

  		// The styles of the gallery
		const styles = {
			galleryLayout: 2,
			allowTitle: true,
			titlePlacement: 'SHOW_ON_HOVER',
			hoveringBehaviour: 'APPEARS',
			cubeImages: true,
			cubeRatio: 1,
			cubeType: 'fit',
			gallerySize: 30,
			imageMargin: 10,
			galleryMargin: 0,
			enableInfiniteScroll: true,
			loadMoreAmount: 'all',
			itemClick: 'expand',
			allowSocial: true,
			loveButton: true,
			arrowsSize: 23,
			overlayAnimation: 'NO_EFFECT',
			imageHoverAnimation: 'NO_EFFECT',
			galleryHorizontalAlign: 'center',
			galleryVerticalAlign: 'center',
			imageLoadingMode: 'BLUR',
			expandAnimation: 'NO_EFFECT',
			scrollAnimation: 'NO_EFFECT',
			allowTitleExpand: true,
			allowDescriptionExpand: true,
			allowLinkExpand: true,
			defaultShowInfoExpand: 1,
			allowFullscreenExpand: true,
			galleryAlignExpand: 'left',
			imageQuality: 90,
			videoPlay: 'hover',
			videoSpeed: 1,
			videoLoop: true,
		};

  // The size of the gallery container. The images will fit themselves in it
		const container = {
			width: '',
			height: 1000,
		};

  // The eventsListener will notify you anytime something has happened in the gallery.
		const eventsListener = (eventName, eventData) => {
			// console.log({eventName, eventData});
		}

		return (
            <div>
                SUCCESS (WITH GALLERY)!!!

            <ProGallery
				domId="ssr-playground"
                items={items}
                styles={styles}
				allowSSR={true}
				container={container}
				eventsListener={eventsListener}
				resizeMediaUrl={resizeMediaUrl}
            />
            </div>
		);
	}
}

  // Enjoy using your new gallery!
  // For more options, visit https://github.com/wix-incubator/pro-gallery

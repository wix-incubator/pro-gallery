
import React from 'react';
import ProGallery from 'pro-gallery/dist/src/components/gallery/proGallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import * as utils from './utils';

export default class Gallery extends React.Component {

	render() {

		const items = utils.mixAndSlice(testItems, 50);

		const urlStyles = utils.getStyleParamsFromUrl();
		const hasUrlStyles = Object.keys(urlStyles) > 0;

		const styles = hasUrlStyles ? urlStyles : utils.defaultStyleParams;

		// The size of the gallery container. The images will fit themselves in it
		const container = (typeof window === 'undefined') ? {
			width: '',
			height: 500,
		} : {
				width: window.innerWidth,
				height: window.innerHeight,
			};

		// The eventsListener will notify you anytime something has happened in the gallery.
		const eventsListener = (eventName, eventData) => {
			// console.log({eventName, eventData});
		}

		(typeof window !== 'undefined') && console.log('[SSR SIMULATOR] Rendering Gallery with params', {items, styles, container});

		return (
			<ProGallery
				domId="ssr-simulator"
				items={items}
				styles={styles}
				allowSSR={true}
				container={container}
				eventsListener={eventsListener}
				resizeMediaUrl={resizeMediaUrl}
			/>
		);
	}
}

  // Enjoy using your new gallery!
  // For more options, visit https://github.com/wix-incubator/pro-gallery


import React from 'react';
import ProGallery from 'pro-gallery/dist/src/components/gallery/proGallery';
import { testItems } from './images';
import { resizeMediaUrl } from './itemResizer';
import { mixAndSlice }  from '../../../../playground/src/utils/utils';
import { getStyleParamsFromUrl }  from '../../../../playground/src/constants/styleParams';

export default class Gallery extends React.Component {

	render() {

		const items = mixAndSlice(testItems, 50);

		const urlStyles = getStyleParamsFromUrl();
		const hasUrlStyles = Object.keys(urlStyles) > 0;

		const styles = hasUrlStyles ? urlStyles : {
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
		};

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

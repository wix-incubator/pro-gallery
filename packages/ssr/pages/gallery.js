import React from 'react';
import Gallery from '../components/gallery';

export default class ProGallerySsr {

	getHeadStylesheets() {
		return [
			'https://static.parastorage.com/services/pro-gallery-santa-wrapper/1.507.0/viewer.css',
			'https://localhost:3200/viewer.css',
		];
	}

	getElements() {
		return <Gallery/>;
	}

	getMetaTags() {
		return [
			{charset: 'utf8'},
			{'http-equiv': 'x-ua-compatible', 'content': 'ie=edge'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{name: 'description', content: 'Pro Gallery, powered by React Server'},
		];
	}
}

import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';
import {ProGallery} from '../src/index';

storiesOf('Gallery', module)
	.add('Default', () => <ProGallery />)
	.add('collage', () => (
		<ProGallery
			styles={{
  galleryLayout: 0,
  itemClick: 'expand'
}}
		/>
	))
	.add('Masonry', () => (
		<ProGallery
			styles={{
  galleryLayout: 1,
  itemClick: 'expand',
  allowSocial: false,
  allowDownload: true,
  loveButton: false
}}
		/>
	))
	.add('Grid', () => (
		<ProGallery
			styles={{
  galleryLayout: 2,
  itemClick: 'expand'
}}
		/>
	))
	.add('Thumbnails', () => (
		<ProGallery
			styles={{
  galleryLayout: 3,
  itemClick: 'expand'
}}
		/>
	))
	.add('Slider', () => (
		<ProGallery
			styles={{
  galleryLayout: 4,
  itemClick: 'expand'
}}
		/>
	))
	.add('Slide Show', () => (
		<ProGallery
			styles={{
  galleryLayout: 5,
  itemClick: 'expand'
}}
		/>
	))
	.add('Strip', () => (
		<ProGallery
			styles={{
  galleryLayout: 6,
  itemClick: 'expand'
}}
		/>
	))
	.add('Column', () => (
		<ProGallery
			styles={{
  galleryLayout: 7,
  itemClick: 'expand'
}}
		/>
	))
	.add('Empty Gallery', () => (
		<ProGallery
			items={[]}
		/>
	))
;
storiesOf('Eyes', module)
  .add('Default', () => <ProGallery />)
  .add('Collage', () => (
    <ProGallery
      styles={{
        galleryLayout: 0
      }}
    />
  ))
  .add('Masonry', () => (
    <ProGallery
      styles={{
        galleryLayout: 1
      }}
    />
  ))
  .add('Grid', () => (
    <ProGallery
      styles={{
        galleryLayout: 2
      }}
    />
  ))
  .add('Thumbnails', () => (
    <ProGallery
      styles={{
        galleryLayout: 3
      }}
    />
  ))
  .add('Slider', () => (
    <ProGallery
      styles={{
        galleryLayout: 4
      }}
    />
  ))
  .add('Slideshow', () => (
    <ProGallery
      styles={{
        galleryLayout: 5
      }}
    />
  ))
  .add('Strip', () => (
    <ProGallery
      styles={{
        galleryLayout: 6
      }}
    />
  ))
;

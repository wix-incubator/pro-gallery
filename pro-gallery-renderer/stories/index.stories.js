import React from 'react';
import {storiesOf} from '@storybook/react';
import {ProGallery} from '../src/index';

const props = {
  items: require('../test/images-mock').testImages
};

storiesOf('Gallery', module)
	.add('Default', () => <ProGallery />)
	.add('collage', () => (
		<ProGallery
      styles={{
        galleryLayout: 0,
        itemClick: 'expand'
      }}
      {...props}
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
      {...props}
		/>
	))
	.add('Grid', () => (
		<ProGallery
      styles={{
        galleryLayout: 2,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Thumbnails', () => (
		<ProGallery
      styles={{
        galleryLayout: 3,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Slider', () => (
		<ProGallery
      styles={{
        galleryLayout: 4,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Slide Show', () => (
		<ProGallery
      styles={{
        galleryLayout: 5,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Strip', () => (
		<ProGallery
      styles={{
        galleryLayout: 6,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Column', () => (
		<ProGallery
      styles={{
        galleryLayout: 7,
        itemClick: 'expand'
      }}
      {...props}
		/>
	))
	.add('Empty Gallery', () => (
		<ProGallery
			items={[]}
		/>
	))
;

storiesOf('Eyes', module)
  .add('Collage', () => (
    <ProGallery
      styles={{
        galleryLayout: 0,
        allowSocial: false,
        allowDownload: true,
        allowTitle: false
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Masonry', () => (
    <ProGallery
      items
      styles={{
        galleryLayout: 1,
        allowDownload: true,
        gallerySize: 10,
        borderRadius: 50
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Grid 1', () => (
    <ProGallery
      styles={{
        galleryLayout: 2,
        loveButton: false,
        titlePlacement: 'SHOW_ON_HOVER',
        allowTitle: true,
        allowDescription: true,
        gallerySize: 5
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Grid 2', () => (
    <ProGallery
      styles={{
        galleryLayout: 2,
        imageMargin: 0,
        titlePlacement: 'SHOW_ABOVE',
        allowTitle: true,
        allowDescription: false
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Grid 3', () => (
    <ProGallery
      styles={{
        galleryLayout: 2,
        imageMargin: 100,
        gallerySize: 10,
        titlePlacement: 'SHOW_BELOW',
        allowTitle: true,
        allowDescription: false
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Thumbnails 1', () => (
    <ProGallery
      styles={{
        galleryLayout: 3,
        titlePlacement: 'DONT_SHOW',
        thumbnailSpacings: 5
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Thumbnails 2', () => (
    <ProGallery
      styles={{
        galleryLayout: 3,
        galleryThumbnailsAlignment: 'left',
        allowDownload: true
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Slider', () => (
    <ProGallery
      styles={{
        galleryLayout: 4,
        allowSocial: false,
        allowDownload: true,
        titlePlacement: 'SHOW_ON_HOVER',
        allowTitle: true,
        allowDescription: true,
        galleryTextAlign: 'left'
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Slideshow', () => (
    <ProGallery
      styles={{
        galleryLayout: 5,
        allowDescription: true
      }}
      forceHover= {true}
      {...props}
    />
  ))
  .add('Strip', () => (
    <ProGallery
      styles={{
        galleryLayout: 6,
        loveButton: false,
        allowDownload: true
      }}
      forceHover= {true}
      {...props}
    />
  ))
;

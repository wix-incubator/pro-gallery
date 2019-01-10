import React from 'react';
import {storiesOf} from '@storybook/react';
import {ProGallery} from '../src/index';
import {getProGalleryStyles} from 'photography-client-lib/dist/src/utils/proGalleryStyleBuilder';

const createProps = (styles, items) => ({
  useRefactoredProGallery: true,
  styles: {...getProGalleryStyles({}), ...styles},
  container: {},
  items: items || require('../test/images-mock').testImages.slice(0, 50)
});

storiesOf('Gallery', module)
  .add('Default', () => (
    <ProGallery
      {...createProps({})}
    />
  ))
  .add('collage', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 0,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Masonry', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 1,
        itemClick: 'expand',
        allowSocial: false,
        allowDownload: true,
        loveButton: false
      })}
		/>
  ))
  .add('Grid', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 2,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Thumbnails', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 3,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Slider', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 4,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Slide Show', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 5,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Strip', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 6,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Column', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 7,
        itemClick: 'expand'
      })}
		/>
  ))
  .add('Empty Gallery', () => (
    <ProGallery
      {...createProps({}, [])}

		/>
  ));

storiesOf('Eyes', module)
  .add('Collage', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 0,
        allowSocial: false,
        allowDownload: true,
        allowTitle: false
      })}
      forceHover= {true}
    />
  ))
  .add('Masonry', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 1,
        allowDownload: true,
        gallerySize: 10,
        itemBorderRadius: 50
      })}
      forceHover= {true}
    />
  ))
  .add('Grid 1', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 2,
        loveButton: false,
        titlePlacement: 'SHOW_ON_HOVER',
        allowTitle: true,
        allowDescription: true,
        gallerySize: 5
      })}
      forceHover= {true}

    />
  ))
  .add('Grid 2', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 2,
        imageMargin: 0,
        titlePlacement: 'SHOW_ABOVE',
        allowTitle: true,
        allowDescription: false
      })}
      forceHover= {true}

    />
  ))
  .add('Grid 3', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 2,
        imageMargin: 100,
        gallerySize: 10,
        titlePlacement: 'SHOW_BELOW',
        allowTitle: true,
        allowDescription: false
      })}
      forceHover= {true}
    />
  ))
  .add('Thumbnails 1', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 3,
        titlePlacement: 'DONT_SHOW',
        thumbnailSpacings: 5
      })}
      forceHover= {true}
    />
  ))
  .add('Thumbnails 2', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 3,
        galleryThumbnailsAlignment: 'left',
        allowDownload: true
      })}
      forceHover= {true}
    />
  ))
  .add('Slider', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 4,
        allowSocial: false,
        allowDownload: true,
        titlePlacement: 'SHOW_ON_HOVER',
        allowTitle: true,
        allowDescription: true,
        galleryTextAlign: 'left'
      })}
      forceHover= {true}
    />
  ))
  .add('Slideshow', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 5,
        allowDescription: true
      })}
      forceHover= {true}
    />
  ))
  .add('Strip', () => (
    <ProGallery
      {...createProps({
        galleryLayout: 6,
        loveButton: false,
        allowDownload: true
      })}
      forceHover= {true}
    />
  ));

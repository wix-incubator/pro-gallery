# Pro Gallery
Create a fast, beautiful galleries built for the web

[![NPM Version](https://img.shields.io/npm/v/pro-gallery.svg?style=flat)](https://www.npmjs.com/package/pro-gallery)
[![Build Status](https://travis-ci.com/wix-incubator/pro-gallery.svg?branch=master)](https://travis-ci.com/wix-incubator/pro-gallery)

## Installation
Install with `npm`
```sh
npm i pro-gallery
```
or `yarn`
```sh
yarn add pro-gallery
```

## Basic Usage

```jsx
import { ProGallery } from 'pro-gallery';
import 'pro-gallery/dist/statics/main.css';

<ProGallery
  items={images}
  styles={styleParams}
  container={container}
/>
```

To see more options and a real usage example, use the [playground code](https://github.com/wix-incubator/pro-gallery/blob/master/packages/playground/src/components/App/App.js) as reference

### Items

A list of objects each containing at least an id, dto, and metadata.

```jsx
const items = [
  {
    itemId: 'sample-id',
    mediaUrl: 'sample-url',
    orderIndex: 0,
    metaData: {
      type: 'image',
      height: 200,
      width: 100,
      name: 'sample-filename',
      title: 'sample-title',
      description: 'sample-description',
      focalPoint: [0, 0],
      link: {
        url: 'http://example.com',
        target: '_blank'
      },
    }
  },
  {...},
  {...}
]
```

### container
An object containing the width and height properties for the gallery

```js
const container = {
  width: 1000,
  height: 500
}
```

### styles
A list of the styles and behaviour parameters for the gallery.

To create you list of styles, use the [playground](https://wix-incubator.github.io/pro-gallery/) and copy the generated code.

## License

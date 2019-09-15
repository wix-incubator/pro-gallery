# Pro Gallery
Blazing fast & beautiful galleries built for the web. [try it out](https://wix-incubator.github.io/pro-gallery/)

[![NPM Version](https://img.shields.io/npm/v/pro-gallery.svg?style=flat)](https://www.npmjs.com/package/pro-gallery)
[![Build Status](https://travis-ci.com/wix-incubator/pro-gallery.svg?branch=master)](https://travis-ci.com/wix-incubator/pro-gallery)

## Installation
Install with `npm`
```sh
npm i -S pro-gallery
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
  domId={domId}
  items={images}
  styles={styleParams}
  container={container}
  scrollingElement={document.getElementById('gallery') || window}
  eventsListener={(eName, eData) => console.log({eName, eData})}
/>
```

To see more options and a real usage example, use the [playground code](https://github.com/wix-incubator/pro-gallery/blob/master/packages/playground/src/components/App/App.js) as reference

### domId
A unique Id for the gallery. Use for multiple galleries in the same page, or when using SSR - to make sure the gallery does not flickr in the hydrate phase.

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

### Container
An object containing the width and height (in pixels) of the gallery.
This values should change when the container resizes, to allow the gallery to be responsive.
```js
const container = {
  width: 1000,
  height: 500
}
```

### Styles
A list of the styles and behaviour parameters for the gallery.
The gallery has many many options that can be modified. To create you list of styles, use the [playground](https://wix-incubator.github.io/pro-gallery/) to create your prefered gallery and copy the generated code.

### Scrolling Element
The DOM element inside which the gallery is scrolled (defaults to `window`). If the gallery is scrolled inside a different element, pass its dom reference in this property.
*notice:* this is relevant to vertical galleries only. Horizontal galleries (e.g. slideshow) are handling the scroll themselves.

### Events Listener
A callback function that get called whenever something happens in the gallery. This allows you to react to specific events.
The most important events are:

| Event Name        |  Description  |
| --------------- | ----------- |
| `GALLERY_CHANGE`  | Fired whenever the gallery finished rendering, usually after the props were changed. This event contains the structure data of the gallery. |
| `ITEM_ACTION_TRIGGERED`  | Fired whenever one of the items is clicked or tapped and the gallery cannot handle the action itself (e.g. open an expanded view) |
| `NEED_MORE_ITEMS`  | Fired whenever the gallery is scrolled near its last item. If you are using a pagination server, this is the event that should trigger the next page and re-render the gallery with the new items |

The full list gallery events is [here](https://github.com/wix-incubator/pro-gallery/blob/master/packages/gallery/src/constants/events.js)

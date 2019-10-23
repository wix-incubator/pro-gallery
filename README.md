# Pro Gallery
Blazing fast & beautiful galleries built for the web. [try it out](https://pro-gallery.surge.sh)

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
  scrollingElement={() => document.getElementById('gallery') || window}
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
  height: 500,
  scrollBase: 0
}
```
The `width` and `height` values represent the size in which the gallery should be. The gallery will size the items to fit exactly in that box. Notice that when infiniteScroll is enabled, vertical galleries will ignore the `height` parameter and horizontal galleries will ignore the `width` parameter.
The `scrollBase` value is important for *vertical* galleries that do not start at the top of the page. It should be the distance of the gallery from the top of the `scrollingElement`. This value can be left empty for the gallery to measure it itself (for better performance, this value should be supplied)

### Styles
A list of the styles and behaviour parameters for the gallery.
The gallery has many many options that can be modified. To create you list of styles, use the [playground](https://pro-gallery.surge.sh) to create your prefered gallery and copy the generated code.

### Scrolling Element
The DOM element inside which the gallery is scrolled (defaults to `window`). If the gallery is scrolled inside a different element, pass its dom reference in this property. You can also pass a function that returns that dom element.
*notice:* this is relevant to vertical galleries only. Horizontal galleries (e.g. slideshow) are handling the scroll themselves.

### Events Listener
A callback function that get called whenever something happens in the gallery. This allows you to react to specific events.
The most important events are:

| Event Name        |  Description  |
| --------------- | ----------- |
| `GALLERY_CHANGE`  | Fired whenever the gallery finished rendering, usually after the props were changed. This event contains the structure data of the gallery. |
| `ITEM_ACTION_TRIGGERED`  | Fired whenever one of the items is clicked or tapped and the gallery cannot handle the action itself (e.g. open an expanded view) |
| `NEED_MORE_ITEMS`  | Fired whenever the gallery is scrolled near its last item. If you are using a pagination server, this is the event that should trigger the next page and re-render the gallery with the new items |

The full list gallery events is [here](https://github.com/wix-incubator/pro-gallery/blob/master/packages/gallery/src/common/constants/events.js)

### Custom Renderers
The Gallery supports custom renderers both for the Hover Element (appears when hoveing over an item) and the Info Element (appears below / above the item).
To replace the default rendering of these element, pass a function that will receive the item's props and should return a JSX element.
for example:
```
<ProGallery
  {...otherProps}
  customHoverRenderer={itemProps => <div>Hover #{itemProps.idx}</div>}
  customInfoRenderer={itemProps => <div>Info #{itemProps.idx}</div>}
/>
```
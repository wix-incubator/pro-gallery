# Pro Gallery 
Blazing fast & beautiful galleries built with React. [try it out](https://pro-gallery.surge.sh)
 - Responsive
 - Lazy loading 
 - Infinite Scroll
 - Fully Customizable
 - Displays Images, Videos and Html

[![NPM Version](https://img.shields.io/npm/v/pro-gallery.svg?style=flat)](https://www.npmjs.com/package/pro-gallery)
[![Build Status](https://travis-ci.com/wix-incubator/pro-gallery.svg?branch=master)](https://travis-ci.com/wix-incubator/pro-gallery)


## Gettings Started
The best way to get started is using the [Playground](https://pro-gallery.surge.sh). Use the sidebar to configure the gallery layout you need for your site and click on `Generate Gallery Code` to get the code for your gallery.
After that you will only need to add your items list and your gallery is ready!

### Installation
Install with `npm`
```sh
npm i -S pro-gallery
```
or `yarn`
```sh
yarn add pro-gallery
```

### Basic Code
```jsx
import { ProGallery } from 'pro-gallery';
import 'pro-gallery/dist/statics/main.css';

<ProGallery
  domId={domId}
  items={items}
  options={options}
  container={container}
  scrollingElement={() => document.getElementById('gallery') || window}
  eventsListener={(eName, eData) => console.log({eName, eData})}
/>
```

To see more options and a real usage example, use the [playground code](https://github.com/wix-incubator/pro-gallery/blob/master/packages/playground/src/components/App/App.js) as reference

### Options
The gallery has A LOT of options, to make it easier to see and use the gallery, we created the [Playground](https://pro-gallery.surge.sh). Each option is expandable in the sidebar, and has all the info you need about its usage. 
Notice that you can click on `Generate Gallery Code` anytime to get the code for the gallery you created.

### Items
A list of objects each containing at least an id, dto, and metadata.
```jsx
const items = [
  { // Image Item:
    itemId: 'sample-id',
    mediaUrl: 'sample-image-url',
    metaData: {
      type: 'image',
      height: 200,
      width: 100,
      title: 'sample-title',
      description: 'sample-description',
      focalPoint: [0, 0],
      link: {
        url: 'http://example.com',
        target: '_blank'
      },
    }
  },
  { // Video Item:
    itemId: 'sample-id',
    mediaUrl: 'sample-video-url',
    metaData: {
      type: 'video',
      height: 200,
      width: 100,
  		poster: 'sample-image-url',
      title: 'sample-title',
      description: 'sample-description',
      focalPoint: [0, 0],
      link: {
        url: 'http://example.com',
        target: '_blank'
      },
    }
  },
  { // HTML Item:
    itemId: 'sample-id',
    html: "<div style='width: 300px; height: 200px; background:pink;'>I am a text block</div>",
    metadata: {
      type: "text",
      height: 200,
      width: 300,
      title: 'sample-title',
      description: 'sample-description',
      backgroundColor: 'pink'
    },

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
}
```
The `width` and `height` values represent the size in which the gallery should be. The gallery will size the items to fit exactly in that box. Notice that when infiniteScroll is enabled, vertical galleries will ignore the `height` parameter and horizontal galleries will ignore the `width` parameter.

### domId
A unique Id for the gallery. Use for multiple galleries in the same page, or when using SSR - to make sure the gallery does not flickr in the hydrate phase.

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
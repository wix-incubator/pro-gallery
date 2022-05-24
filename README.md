<h1 align="center">
  <img src="logo.png"/><br/>
  Pro Gallery
</h1>

Blazing fast & beautiful galleries built with React. [Try it out now.](https://pro-gallery.surge.sh)
 - Responsive
 - Lazy loading
 - Infinite Scroll
 - Fully Customizable
 - Supports images, videos, and HTML

[![NPM Version](https://img.shields.io/npm/v/pro-gallery.svg?style=flat)](https://www.npmjs.com/package/pro-gallery)
[![Build Status](https://travis-ci.org/wix/pro-gallery.svg?branch=master)](https://travis-ci.com/wix/pro-gallery)


## Gettings Started
The best way to get started is by using the [Playground](https://pro-gallery.surge.sh). Use the sidebar to configure the gallery layout you need. When you're done,  click the `Generate Gallery Code` button to get the copy-paste-ready code.
All you need to do after that is specify the images `array` for the gallery to process - and your gallery is ready!

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
export default function Gallery() {
	// Add your images here...
	const items = [
		{ // Image item:
			itemId: 'sample-id',
			mediaUrl: 'https://i.picsum.photos/id/674/200/300.jpg?hmac=kS3VQkm7AuZdYJGUABZGmnNj_3KtZ6Twgb5Qb9ITssY',
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
		{ // Another Image item:
			itemId: 'differentItem',
			mediaUrl: 'https://i.picsum.photos/id/1003/1181/1772.jpg?hmac=oN9fHMXiqe9Zq2RM6XT-RVZkojgPnECWwyEF1RvvTZk',
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
		{ // HTML item:
			itemId: 'htmlItem',
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
	]

	// The options of the gallery (from the playground current state)
	const options = {
		galleryLayout: -1,
	};

	// The size of the gallery container. The images will fit themselves in it
	const container = {
		width: window.innerWidth,
		height: window.innerHeight
	};

	// The eventsListener will notify you anytime something has happened in the gallery.
	const eventsListener = (eventName, eventData) => console.log({eventName, eventData}); 

	// The scrollingElement is usually the window, if you are scrolling inside another element, suplly it here
	const scrollingElement = window;

	return (
		<ProGallery
			items={items}
			options={options}
			container={container}
			eventsListener={eventsListener}
			scrollingElement={scrollingElement}
		/>
	);
}
```

To see more options and a real usage example, use the [playground source code](https://github.com/wix/pro-gallery/blob/master/packages/playground/src/components/App/App.js) as reference.

### Options
The gallery has A LOT of options, so to make it all easier, we created the [Playground](https://pro-gallery.surge.sh). Each option is expandable in the sidebar, and has all the info you need about using it.
Notice that you can click on `Generate Gallery Code` anytime to get the code for the gallery layout you created.


### Container
An object containing the width and height (in pixels) of the gallery.
These values should change when the container resizes, to allow the gallery to be responsive.
```js
const container = {
  width: 1000,
  height: 500,
}
```
The `width` and `height` values represent the size of the gallery. Thus, the gallery will size inner items to fit exactly into that size. Notice that when `infiniteScroll` is enabled, vertical galleries will ignore the `height` parameter and horizontal galleries will ignore the `width` parameter.

### id
A unique id for the gallery. Use this if you plan to display multiple galleries on the same page, or when using SSR - to make sure the gallery does not "flicker" in the hydrate phase.

### Scrolling Element
The DOM element inside which the gallery is scrolled (defaults to `window`). If the gallery is scrolled inside a different element, pass its dom reference in this property. You can also pass a function that returns that dom element.
*notice:* this is relevant to vertical galleries only. Horizontal galleries (e.g. slideshow) are handling the scroll themselves.

### Events Listener
A callback function that gets called whenever something happens in the gallery. This allows you to react to specific events.
The most important events are:

| Event Name        |  Description  |
| --------------- | ----------- |
| `GALLERY_CHANGE`  | Fired whenever the gallery finished rendering, usually after the props were changed. This event contains the structure data of the gallery. |
| `ITEM_ACTION_TRIGGERED`  | Fired whenever one of the items is clicked or tapped and the gallery cannot handle the action itself (e.g. open an expanded view). |
| `NEED_MORE_ITEMS`  | Fired whenever the gallery is scrolled near its last item. If you are using a pagination server, this is the event that should trigger the next page and re-render the gallery with new items. |

The full list of the gallery events is [here](https://github.com/wix/pro-gallery/blob/master/packages/lib/src/common/constants/events.js).

### Media URL Resizer
If you want to use a server-side resizing service (e.g. cloudinary), you can pass a resizing function. This function receives the `item` and required dimensions and should return the resize url. Notice that this function will be called several times for each item so it should be fast.
An example can be found [here](https://github.com/wix/pro-gallery/blob/a3d858fc275135e73b233392c3eb927bd47bd8d0/packages%2Fplayground%2Fsrc%2Futils%2FitemResizer.js)

### Prerender Mode
The prerender mode is a special middle phase for situations where the gallery is rendered in a responsive layout in SSR - *without the real container measurements*. This render will not be accurate until the client will "fix" the layout (since the server cannot measure the size of the container).
When passing the gallery a "fake" container measurements, you'll need to pass this parameter as true to let the gallery know it should only prepare the html, but wait for the real measurements before showing the gallery

### Custom Components
The Gallery supports replacing the default rendering of the following elements:
- Hover Element (appears when hovering over an item)
- Info Element (appears below / above /on the right / on the left of the item).
- Slideshow Info Element (appears below the item when gallery layout is slideshow)
- Navigation Arrows Buttons (for horizontal layouts)
- Load More button (for vertical layouts)
- Image Elements (to render the image items)

To replace the default rendering of these elements, pass to the customComponents, to the relevant key a function that will receive the props of an item and that in turn should return a JSX element. For example:
```
<ProGallery
  {...otherProps}
  customComponents={{
      customHoverRenderer={itemProps => <div>Hover #{itemProps.idx}</div>}
      customInfoRenderer={itemProps => <div>Info #{itemProps.idx}</div>}
      customImageRenderer={imageProps => <img {...imageProps} />}
      customLoadMoreRenderer={galleryProps => <button>Load More</button>}
      customNavArrowsRenderer={direction => <button>{direction}</button>}
  }}
/>
```
### Accessibility Aria role
The gallery allows setting the aria role attribute of its container by passing a prop. The default value is “region” (read more about the different options of the “role” attribute [here](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles))
```
<ProGallery
  {...otherProps}
  proGalleryRole: 'application'
/>
```

## Version 3
Version 3 introduces a clear separation between logic and rendering in the pro-gallery.

The `ProGalleryRenderer` is a new export of the pro-gallery.
It will expect a ready gallery Blueprint spread into the props it receives.

### Blueprint
We call the result of all the calculations that the `ProGalleryRenderer` needs a Blueprint.

To create a Blueprint we need :
- Options
- Items
- Container
- totalItemsCount

The result is an object containing the processed styles, items,container and structure to be passed to the ProGalleryRenderer as props.

### Benefits of splitting
With the code that calculates the blueprint split from the rendering components we can create the blueprint for the gallery wherever we want and only import the rendering code (smaller) in the main thread. The blueprint itself can be calculated in a web worker or even in a server.

To learn how to use the Blueprints and the BlueprintsManager go to the [pro-gallery-lib readme](https://github.com/wix/pro-gallery/tree/master/packages/lib).

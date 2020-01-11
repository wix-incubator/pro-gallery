# Collage Gallery

##  Props

| PROP | TYPE | OPTIONS | DEFAULT | DESCRIPTION
|--|--|--|--|--|
| orientaion | string | ROWS <br/> COLS | ROWS | align items in rows or columns
| rtl | bool | | false | align items and texts right to left
| spacing | number | | 10 | the spacing between items in pixels
| scrollDirection | string | VERTICAL <br/> HORIZONTAL | VERTICAL | the direction of the gallery
| itemSize | number | | 300 | the target size of each row <br/> column (in pixels)
| info | string | ABOVE <br/> BELOW <br/> HOVER <br/> NONE | hover | the placement of the info section for each item
| play | string | AUTO <br/> HOVER <br/> ON_CLICK | HOVER | the playing event of videos
| hoveringBehaviour | string | APPEARS <br/> DISAPPEARS <br/> NO_CHANGE | APPEARS | show or hide the hover element on hover
| overlayAnimation | string | NO_EFFECT <br/> FADE_IN <br/> EXPAND <br/> SLIDE_UP <br/> SLIDE_RIGHT | NO_EFFECT | the animation of the overlay of each item
| imageHoverAnimation | string | NO_EFFECT <br/> ZOOM_IN <br/> BLUR <br/> GRAYSCALE <br/> SHRINK <br/> INVERT <br/> COLOR_IN <br/> DARKENED | NO_EFFECT | the hover animation of the image 
| scrollAnimation | string | NO_EFFECT <br/> FADE_IN <br/> GRAYSCALE <br/> SLIDE_UP <br/> EXPAND <br/> SHRINK <br/> ZOOM_OUT <br/> ONE_COLOR <br/> MAIN_COLOR <br/> BLUR | NO_EFFECT | the animation of new items that scorll into view

## Code Sample

```jsx
  import { CollageGallery } from 'pro-gallery';

  export function Gallery() {

    const items = [];

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
      <CollageGallery
        items={items}
        options={options}
        container={container}
        eventsListener={eventsListener}
        scrollingElement={scrollingElement}

        orientaion="rows"
        rtl={false}
        spacing={10}
        scrollDirection="vertical"
        itemSize={300}
        info="none"
        scrollAnimation="EXPAND"
      />
    );
  }
```

## Base Props

### Items
For the code you generated to work you need to do just one more thing - provide it with a list of objects, each containing at least an id, dto, and metadata:
```jsx
const items = [
  { // Image item:
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
  { // Video item:
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
  { // HTML item:
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
These values should change when the container resizes, to allow the gallery to be responsive.
```js
const container = {
  width: 1000,
  height: 500,
}
```
The `width` and `height` values represent the size of the gallery. Thus, the gallery will size inner items to fit exactly into that size. Notice that when `infiniteScroll` is enabled, vertical galleries will ignore the `height` parameter and horizontal galleries will ignore the `width` parameter.

### domId
A unique Id for the gallery. Use this if you plan to display multiple galleries on the same page, or when using SSR - to make sure the gallery does not "flicker" in the hydrate phase.

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

The full list of the gallery events is [here](https://github.com/wix-incubator/pro-gallery/blob/master/packages/gallery/src/common/constants/events.js).

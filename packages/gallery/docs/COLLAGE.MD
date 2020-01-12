# Collage Gallery

##  Style Props

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

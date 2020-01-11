# Collage Gallery

##  Props

| PROP | TYPE | DEFAULT | DESCRIPTION
|--|--|--|--|
| orientaion | rows / cols | rows | align items in rows or columns
| rtl | bool | false | align items and texts right to left
| spacing | number | 10 | the spacing between items in pixels
| scrollDirection | vertical / horizontal | vertical | the direction of the gallery
| itemSize | number | 300 | the target size of each row / column (in pixels)
| info | above / below / hover / none | hover | the placement of the info section for each item
| play | auto / hover / onClick | hover | the playing event of videos
| hoveringBehaviour | APPEARS / DISAPPEARS / NO_CHANGE | APPEARS | show or hide the hover element on hover
| overlayAnimation | NO_EFFECT / FADE_IN / EXPAND / SLIDE_UP / SLIDE_RIGHT | NO_EFFECT | the animation of the overlay of each item
| imageHoverAnimation | NO_EFFECT / ZOOM_IN / BLUR / GRAYSCALE / SHRINK / INVERT / COLOR_IN / DARKENED | NO_EFFECT | the hover animation of the image 
| scrollAnimation | NO_EFFECT / FADE_IN / GRAYSCALE / SLIDE_UP / EXPAND / SHRINK / ZOOM_OUT / ONE_COLOR / MAIN_COLOR / BLUR | NO_EFFECT | the animation of new items that scorll into view

## Code Sample

```
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
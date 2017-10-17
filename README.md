# Pro Gallery Layouter
This module creates a layout from a list of items, each containing an id, width and height. The layout is fitted to a specified container and is adjusted by a set of style params. It also handles viewport visibility to render only the items in the viewport.

# Get Started
## Installation
`npm i pro-gallery-layouter`

Notice: this module is currently available only in the wix-private repository.

## Usage
```
import {Layouter} from 'pro-gallery-layouter';
const items = [{
  id: '2d3b675ea857dc41158bad3b28300824',
  width: 5600,
  height: 3730
},{id, width, height},...];
const styleParams = {
  rowSize: 500,
  isColumnsLayout: false,
  ...
};
const container = {
  width: window.innerWidth,
  height: window.innerHeight
};
const layoutParams = {
  items,
  styleParams,
  container
};

const layout = new Layouter(layoutParams);
```
Using the layout object to render html can be done in several ways. See [demos](/demos).

# Layout Params:

`isVerticalScroll` _(true / false)_:

When set to true, the layout will occupy the entire container width and will add items to the bottom. When set to false, the layout will occupy the entire height of the container and will add items to the left.

`isColumnsLayout` _(true / false)_:

When set to true, the layout will consist of columns (similar to [pinterest](https://www.pinterest.com/categories/everything/) layouts). When set to false, the layout will consist of rows (similar to [flickr](https://www.flickr.com/explore) layouts)

`columnSize/rowSize` _(integer)_:

The target size (in pixels) of each row/column. This size is approximated since the layouter will shrink/enlarge each row/column to fit the items to the container.

`minItemSize` _(integer)_:

The minimal size (in pixels) of items in groups. The layouter will try to avoid groups that create items smaller than this size.

`cropItems` _(true / false)_:

When set to true, all items will be cropped according to the specified crop parameters. When set to false, all items will be displayed in their original ratio.

`cropType` _('fit' / 'fill')_:

When set to 'fill', the items will be cropped to fill the entire rectangle defined by the cropRatio. When set to 'fit' the item will be resized to fit inside the same rectangle.

`cropRatio` _(float)_:

The ratio (width/height) of the rectangle that will hold the items (e.g. 1.33 will create rectangles with a standard 4/3 ratio).

`smartCrop` _(true / false)_:

When set to true, items will be cropped according to their original ratio as landscape or portrait.

`itemSpacing` _(integer)_:

The space between items (in pixels).

`randomSpacings` _(0 - 100)_:

The percent of "randomness" to add to the layout spacings. The higher the percentage, the more scattered the layout will appear.

`itemsPerGroup` _(1 - 3)_:

Determines the maximum number of items that can be grouped together in collage mode.

`smartGrouping` _(true / false)_:

When set to true, the group types will be selected according to the ratio of the items in the group in order to avoid uneven sizing of items in each group.

`allowedGroupTypes` _(subarray of ['1','2h','2v','3h','3v','3t','3b','3l','3r'])_:

The allowed group types for collage layouts [learn more](https://docs.google.com/presentation/d/1RGRkSmXV94dKXL-7umXcJXsgOGwcBRu0l9AcfShV21I/edit#slide=id.g2704b1b40a_0_370)

`collageDensity` _(0 - 100)_:

The percentage of "collaging" the layouter will create. The higher the percentage, the more items will be grouped.

# Learn More

* [Behind the Pro Gallery Layouter](https://docs.google.com/presentation/d/1rtLFsgeQTUGt4lTU-cLaBKhKsalQasDA6FPeBiKuJZo/present) a presentaion that explains the collage algorithm

* [Group Types](https://docs.google.com/presentation/d/1RGRkSmXV94dKXL-7umXcJXsgOGwcBRu0l9AcfShV21I/edit#slide=id.g2704b1b40a_0_370) a presentaion that displays the different group types in the collage layout

* [Viewport Visibility Demo](http://wix-private.github.io/pro-gallery-statics/) see the layouter hides and show items according to their location in the viewport

* [Pro Gallery Playground](https://progallery.wix.com/playground.html) the place where you can play with the different styleParams to create new and stunning© layouts

# Demos
To see how to use the layouter, check out the [Demos](/demos)

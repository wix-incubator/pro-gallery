# Pro Gallery Layouter ([DEMO](https://wix-incubator.github.io/pro-gallery-layouter/))

This module creates a layout from a list of items, each containing an id, width and height. The layout is fitted to a specified container and is adjusted by a set of style params. It also handles viewport visibility to render only the items in the viewport.

- [Getting started](#getting-started)
- [API](#api)
- [Usage with React](#usage-with-react)
- [Examples](#examples)
- [Learn more](#learn-more)

# Getting started
## Installation
`npm i pro-layouts`

## Usage
```javascript
import {createLayout} from 'pro-layouts';

const layoutParams = {
  styleParams: {/* ... */},
  items: [/* ... */],
  container: {/* ... */}
};

// Use layout object to render layout
const layout = createLayout(layoutParams);
```
Rendering HTML from `layout` can be done in several ways. See [examples](#examples).

# API

- [createLayout](#createlayout)
- [Layouter](#layouter)
  - [constructor](#constructor)
  - [findNeighborItem](#findneighboritem)
  - [lastVisibleItemIdx](#lastvisibleitemidx)
  - [createLayout](#createlayout-1)
- [layoutParams](#layoutparams)
  - [styleParams](#styleparams)
  - [container](#container)
  - [items](#items)
- [layout](#layout)

## createLayout

Simplest way to create a layout. Suitable for most uses.

**Arguments:**

1. [`layoutParams`](#layoutparams) _(object)_

**Returns**

[`layout`](#layout) _(object)_

## Layouter

Use it to create responsive layouts and/or for rendering only visible items.
Check out [responsive example](/examples/responsive.js) for more info.

### constructor

**Arguments:**

1. [`layoutParams`](#layoutparams) _(object)_

### calcVisibilities

**Returns**

[`layout`](#layout) _(object)_

### findNeighborItem

### lastVisibleItemIdx

<h3>createLayout</h3>

**Arguments:**

1. [`layoutParams`](#layoutparams) _(object)_

**Returns**

[`layout`](#layout) _(object)_

## layoutParams

The object contains: [styleParams](#styleparams), [container](#container), [items](#items).

### styleParams

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

`externalInfoHeight` _(integer)_:

A fixed empty space (in pixels) at the bottom or at the top of each image (for title / buttons etc.)

`itemsPerGroup` _(1 - 3)_:

Determines the maximum number of items that can be grouped together in collage mode.

`smartGrouping` _(true / false)_:

When set to true, the group types will be selected according to the ratio of the items in the group in order to avoid uneven sizing of items in each group.

`allowedGroupTypes` _(subarray of ['1','2h','2v','3h','3v','3t','3b','3l','3r'])_:

The allowed group types for collage layouts [learn more](https://docs.google.com/presentation/d/1RGRkSmXV94dKXL-7umXcJXsgOGwcBRu0l9AcfShV21I/edit#slide=id.g2704b1b40a_0_370)

`collageDensity` _(0 - 100)_:

The percentage of "collaging" the layouter will create. The higher the percentage, the more items will be grouped.

### container

`width` _(integer)_:

Width of the container

`height` _(integer)_:

Width of the container

### items

Array of objects with this schema:

`id` _(string)_:

Unique id

`width` _(integer)_:

Original width of the item

`height` _(integer)_:

Original height of the item

## layout

Object returned by [createLayout](#createlayout), [calcVisibilities](#calcvisibilities), [Layouter.createLayout](#createlayout-1).
The object contains: [height](#height), [items](#items-1), [groups](#groups), [strips](#strips), [columns](#columns).

### height

_(integer)_

### items

_(arrayof [item](#item))_

### item

```javascript
{
  id,
  idx,
  inGroupIdx,
  dto,
  type,
  style,
  width,
  maxWidth,
  outerWidth,
  height,
  maxHeight,
  outerHeight,
  margins,
  ratio,
  cropRatio,
  isCropped,
  cropType,
  group,
  offset,
  groupOffset,
  transform,
  orientation,
  isPortrait,
  isLandscape,
  visibility
}
```

### groups

_(arrayof [group](#group))_

### group

```javascript
{
  id,
  idx,
  stripIdx,
  inStripIdx,
  isLastGroup,
  items,
  type,
  width,
  height,
  totalHeight,
  ratio,
  top,
  left,
  right,
  bottom,
  visible,
  rendered,
  required
}
```

### strips

_(arrayof [strips](#strips))_

### strip

_(arrayof [group](#group))_

### columns

_(arrayof [column](#column))_

### column

_(arrayof [group](#group))_


# Usage with React

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {createLayout} from 'pro-layouts';

const getImageStyle = item => ({
  ...item.offset,
  width: item.width,
  height: item.height,
});

const Gallery = ({ layoutParams }) => {
  const layout = createLayout(layoutParams);
  return (
    <div style={{ height: layout.height }}>
      {layout.items.map(item => (
        <img key={item.id} src={item.dto.url} style={getImageStyle(item)} />
      ))}
    </div>
  );
};

const layoutParams = {
  styleParams: {/* ... */},
  items: [/* ... */],
  container: {/* ... */}
};

ReactDOM.render(<Gallery layoutParams={layoutParams}/>, document.getElementById('root'));
```

# Examples

To see how to use the layouter, check out the [Examples](/examples).
(all demos are in vanilla js, but you need to import the library)

- [Absolute positioning example](/examples/absolute.js) uses absolute positioning to display the layout
- [Relative positioning example](/examples/relative.js) uses relative positioning to display the layout
- [Responsive example](/examples/relative.js) takes advantage of the [Layouter](#layouter) to implement responsive layout where only visible items are rendered

# Learn More

- [Behind the Pro Gallery Layouter](https://docs.google.com/presentation/d/1rtLFsgeQTUGt4lTU-cLaBKhKsalQasDA6FPeBiKuJZo/present) a presentation that explains the collage algorithm
- [Group Types](https://docs.google.com/presentation/d/1RGRkSmXV94dKXL-7umXcJXsgOGwcBRu0l9AcfShV21I/edit#slide=id.g2704b1b40a_0_370) a presentation that displays the different group types in the collage layout

# Pro Gallery Renderer

# Props

**items**
A list of objects each containing at least an id, dto, and metadata (ToDo - specify full specs)

**totalItemsCount**
The total number of items that the gallery contains (if this number is larger than the number of the items list, a call to `fetchMoreItem` will happen as soon as the last item is displayed

**styles**
A list of the styles and behaviour defs for the gallery (ToDo - specify full specs)

**container**
An object containing the width and height properties for the gallery

**watermarkData**

**onInit**
This function will run as soon as the gallery is loaded

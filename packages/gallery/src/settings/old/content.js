export default {
  allowLeanGallery: {
    title: 'Allow Lean Gallery',
    description: "render a css grid gallery if the options allow it. This will run much less code and render faster.",
  },
  isStore: {
    title: 'Is store',
    description: "",
  },
  showAddToCartSection: {
    title: 'show Add To Cart Section',
    description: "",
  },
  canUseWatermark: {
    title: 'can Use Watermark',
    description: "",
  },

  galleryLayout: {
    title: 'Presets',
    description: "",
  },
  slideshowLoop: {
    title: 'Loop Images',
    description: "When set to true, the gallery will loop through the images seemlessly i.e. after scrolling past the last image, the gallery will show the first image again.",
  },
  isAutoSlideshow: {
    title: 'Auto Slide',
    description: "Then set to true, the gallery will change the current item automatically after a specified interval",
  },
  autoSlideshowInterval: {
    title: 'Time Between Images',
    description: "When using auto slide, use this to set the time between current item change",
  },
  slideshowInfoSize: {
    title: 'Info bar size',
    description: "In slideshow, this parameter sets the space below the image to display the title description etc. Enlarging this size will reduce the size of the image so that both of them will take the full container.",
  },
  playButtonForAutoSlideShow: {
    title: 'Play button',
    description: "When true, auto slide will show a play/pause button to toggle the transitions",
  },
  scrollDirection: {
    title: "Scroll Direction",
    description: "This parameter will toggle between two types of galleries. Vertical and Horizontal. Notice that many options are available only for a specific scroll direction.",
  },
  isVertical: {
    title: "Layout Orientation",
    description: "Organize images in Rows or Columns the number of columns or row size will be determined by the container size",
  },
  isRTL: {
    title: "Layout Direction",
    description: "Order images Right to Left or Left to Right, this will also have an effect on slide direction and text direction",
  },
  allowSlideshowCounter: {
    title: "Slideshow counter",
    description: "Display an index of the current slide",
  },
  titlePlacement: {
    title: "Texts Placement",
    description: "Determines the position of the title, description and buttons relative to the image",
  },
  hoveringBehaviour: {
    title: "Hover Effect",
    description: "Determines whether the texts appear or disappear when hovering over items",
  },
  cubeImages: {
    title: "Crop Images",
    description: "When true, items will be cropped to fit the container. When false, the container wil resize to fit each image.",
  },
  cubeType: {
    title: "Items Resize",
    description: "When using a fixed sized container, you can crop the images, or resize them to fit inside the container. Notice that choosing the Fit option will leave some empty margin around each image.",
  },
  cubeRatio: {
    title: "Item Crop Ratio",
    description: "The Ratio between the width and height of the cropped, this is a string that will be evaluated on runtime. Use 'X%/Y%' to indicate that the ratio is responsive. e.g. '1' is a square, '16/9' is a wide screen rectangle and '100%/50%' is full width and half the height of the container.",
  },
  gallerySliderImageRatio: {
    title: "Item Crop Ratio - Slider",
    description: "The Ratio between the width and height of the cropped, this is a string that will be evaluated on runtime. Use 'X%/Y%' to indicate that the ratio is responsive. e.g. '1' is a square, '16/9' is a wide screen rectangle and '100%/50%' is full width and half the height of the container.",
  },
  galleryThumbnailsAlignment: {
    title: "Thumbnail Position",
    description: "The position of the thumbnails relative to the gallery. Notice that this will change the ratio of the images so that both the thumbnails and the images will fit inside the container",
  },
  thumbnailSize: {
    title: "Thumbnail Size",
    description: "width and height of each thumbnail aside the gallery",
  },
  gridStyle: {
    title: "Responsive Type",
    description: "Choose whether to adjust the number of columns according to the container size or keep it fixed",
  },
  gallerySizeType: {
    title: "Item Size Units",
    description: "Choose which units to use when setting the target size of each item: by layout, relative to width or in pixels (recommended)",
  },
  gallerySize: {
    title: "Item Size (smart)",
    description: "Set the item size between 1 to 100 units. The real size will be determined by the layout.",
  },
  gallerySizePx: {
    title: "Item Size (in pixels)",
    description: "Set the target size of each item in pixels. Notice that the actual size will change to fit the container size",
  },
  gallerySizeRatio: {
    title: "Item Size (relative to width)",
    description: "Set the items size relative to the width of the container",
  },
  numberOfImagesPerRow: {
    title: "Images Per Row",
    description: "Set a fixed number of images per row. This will not change the layout when resizing the container (i.e. not responsive).",
  },
  numberOfImagesPerCol: {
    title: "Images Per Column",
    description: "Set the number of images per column.",
  },
  groupSize: {
    title: "Max Group Size",
    description: "Set the max number of images to group together when creating a collage. Choose 1 if you want to avoid collaging altogether or 3 if you want to group up to 3 images together",
  },
  groupsPerStrip: {
    title: "Groups per Row",
    description: "This will set the number of groups in a row. Notice, this will ignore the size of the container (i.e. not responsive)",
  },
  groupTypes: {
    title: "Allowed Group Types",
    description: "The allowed groups types to use in collage (advanced). To learn more about group types, go to the Wiki in the github repo.",
  },
  rotatingGroupTypes: {
    title: "Repeating Group Types",
    description: "Determine a specific order of groups types to use in collage (advanced). To learn more about group types, go to the Wiki in the github repo.",
  },
  thumbnailSpacings: {
    title: "Spacing between Thumbnails",
    description: "The space (in pixels) between thumbnails",
  },
  imageMargin: {
    title: "Spacing between Items",
    description: "The space (in pixels) between the items. Notice, this will reduce the size of each item, but will not change the displayed ratio of the items.",
  },
  galleryMargin: {
    title: "Gallery Spacing",
    description: "The space from the container to the gallery",
  },
  floatingImages: {
    title: "floating Images",
    description: "Set a random offset to each image, in the boundaries of the margin.",
  },
  collageDensity: {
    title: "Collage Density",
    description: "Detemine how much 'collaging' to create. When set to minimum, all groups will be of 1 item. When set to maximum, all groups will be set to 3 items.",
  },
  enableInfiniteScroll: {
    title: "Use Infinite Scroll",
    description: "When true, new items will load automatically when scrolling the page. When false, a 'load more' button will be shown to load more items. Notice, adding more items is done by the consumer when the gallery emits the NEED_MORE_ITEMS event.",
  },
  loadMoreAmount: {
    title: "Load More Behaviour",
    description: "Choose whether clicking the 'load more' button toggle an infinite scroll behaviour or adds a few more items and keep the button at the bottom.",
  },
  //----------| SETTINGS SECTION |---------//
  scrollSnap: {
    title: 'Snap Scroll',
    description: "When true, scrolling will snap to the center of the closest item. When false, scrolling will not snap",
  },
  itemClick: {
    title: 'When clicking on an item:',
    description: "",
  },
  //------------------------ Design ----------------------//
  itemOpacity: {
    title: 'Color Overlay',
    description: "",
  },
  itemIconColorSlideshow: {
    title: 'Icon color',
    description: "",
  },
  itemIconColor: {
    title: 'Icon color',
    description: "",
  },
  arrowsSize: {
    title: 'Navigation Arrows Size',
    description: "The size of the right and left navigation arrows in pixels",
  },
  arrowsColor: {
    title: 'Navigation Arrows Color',
    description: "",
  },
  arrowsPosition: {
    title: 'Navigation Arrows Position',
    description: "Choose whther to display the navigation inside or outside the gallery. Notice, setting the arrows position on the outside will reduce the size of the gallery.",
  },
  overlayAnimation:  {
    title: 'Overlay Hover Animation',
    description: "Choose an effect to show the overlay when hovering over an image",
  },
  imageHoverAnimation: {
    title: 'Image Hover Animation',
    description: "Choose an effect that happens to the image when hovering over it",
  },
  itemFont: {
    title: 'Title Font',
    description: "",
  },
  itemFontColor: {
    title: 'Title Font Color',
    description: "",
  },
  itemFontSlideshow: {
    title: 'Title Font',
    description: "",
  },
  itemFontColorSlideshow: {
    title: 'Title Font Color',
    description: "",
  },
  itemDescriptionFont: {
    title: 'Description Font',
    description: "",
  },
  itemDescriptionFontColor: {
    title: 'Description Font Color',
    description: "",
  },
  itemDescriptionFontSlideshow: {
    title: 'Description Font',
    description: "",
  },
  itemDescriptionFontColorSlideshow: {
    title: 'Description Color',
    description: "",
  },
  textBoxFillColor: {
    title: 'Fill Color & Opacity',
    description: "",
  },
  calculateTextBoxWidthMode: {
    title: 'Text Box Width Units',
    description: "",
  },
  textBoxHeight: {
    title: 'Text Box Height',
    description: "",
  },
  textBoxWidth: {
    title: 'Text Box Width (pixels)',
    description: "The width of info element in pixels",
  },
  textBoxWidthPercent: {
    title: 'Text Box Width (percent)',
    description: "The partial width of the info element from the width of the item",
  },
  textImageSpace: {
    title: 'Text Space From Image',
    description: "",
  },
  textBoxBorderRadius: {
    title: 'Text box corner radius',
    description: "",
  },
  textBoxBorderWidth: {
    title: 'Text box border width',
    description: "",
  },
  textBoxBorderColor: {
    title: 'Text box border color',
    description: "",
  },
  loadMoreButtonText: {
    title: 'load more Button Text',
    description: "",
  },
  loadMoreButtonFont: {
    title: 'Load More Button Font',
    description: "",
  },
  loadMoreButtonFontColor: {
    title: 'Load More Button Font Color',
    description: "",
  },
  loadMoreButtonColor: {
    title: 'Button Color & Opacity',
    description: "",
  },
  loadMoreButtonBorderWidth: {
    title: 'Load More Border Width',
    description: "",
  },
  loadMoreButtonBorderColor: {
    title: 'Load More Border Color',
    description: "",
  },
  loadMoreButtonBorderRadius: {
    title: 'Load More Border Radius',
    description: "",
  },
  imageInfoType: {
    title: 'Choose info layout',
    description: "",
  },
  itemBorderWidth: {
    title: 'item Border Width',
    description: "",
  },
  itemBorderColor: {
    title: 'item Border Color & Opacity',
    description: "",
  },
  itemBorderRadius: {
    title: 'item Border Radius',
    description: "",
  },
  itemEnableShadow: {
    title: 'Show Box Shadow',
    description: "Show a shadow around each image",
  },
  itemShadowOpacityAndColor: {
    title: 'Shadow Opacity & Color',
    description: "",
  },
  itemShadowBlur: {
    title: 'Shadow Blur',
    description: "",
  },
  itemShadowDirection: {
    title: 'Shadow Direction',
    description: "",
  },
  itemShadowSize: {
    title: 'Shadow Size',
    description: "",
  },
  imageLoadingMode: {
    title: 'Loading Placeholder',
    description: "Determines what is shown until the image is loaded",
  },
  imageLoadingColor: {
    title: 'Color Background Placeholder',
    description: "",
  },
  expandAnimation: {
    title: 'How does your expand mode open?',
    description: "",
  },
  scrollAnimation: {
    title: 'Scroll Animation',
    description: "Choose how images appear when scrolling down the page",
  },
  oneColorAnimationColor: {
    title: 'Color Animation',
    description: "Choose a color to show until the images are loaded",
  },
  allowLinkExpand: {
    title: 'Link',
    description: "",
  },
  expandInfoPosition: {
    title: 'Where does it appear?',
    description: "",
  },
  defaultShowInfoExpand: {
    title: 'Choose how images appear when scrolling down the page',
    description: "",
  },
  allowFullscreenExpand: {
    title: 'Allow full screen',
    description: 'Viewers can open images in full screen mode.',
  },
  fullscreenLoop: {
    title: 'Loop images',
    description: 'Viewers can scroll through images in a continuous loop.',
  },
  bgColorExpand: {
    title: 'Background color',
    description: "",
  },
  actionsColorExpand: {
    title: 'Icon color',
    description: "",
  },
  titleFontExpand: {
    title: 'title Font Expand',
    description: "",
  },
  titleColorExpand: {
    title: 'title Color Expand',
    description: "",
  },
  descriptionFontExpand: {
    title: 'description Font Expand',
    description: "",
  },
  descriptionColorExpand: {
    title: 'description Color Expand',
    description: "",
  },
  galleryAlignExpand: {
    title: 'Text alignment',
    description: "",
  },
  addToCartBackColorExpand: {
    title: 'addToCartBackColorExpand - Button color & opacity',
    description: "",
  },
  addToCartFontExpand: {
    title: 'add To Cart Font Expand',
    description: "",
  },
  addToCartColorExpand: {
    title: 'add To Cart Color Expand',
    description: "",
  },
  addToCartBorderWidth: {
    title: 'add To Cart Border width',
    description: "",
  },
  addToCartBorderColor: {
    title: 'add To Cart Border Color',
    description: "",
  },
  addToCartButtonText: {
    title: 'add To Cart Button Text',
    description: "",
    maxLength: 30,
  },
  imageQuality: {
    title: 'Image Quality',
    description: 'Higher quality images often take longer to load. The recommended setting is 90%. (JPEG images only)',
  },
  usmToggle: {
    title: 'Image Sharpening',
    description: 'Sharpen all images in this gallery using the Amount, Radius and Threshold controls.',
  },
  usm_a: {
    title: 'Amount',
    description: '',
  },
  usm_r: {
    title: 'Radius',
    description: '',
  },
  usm_t: {
    title: 'Threshold (Levels)',
    description: '',
  },
  hidePlay: {
    title: 'Hide Video Play Button',
    description: 'Show videos without a play button. Notice that using this option will display videos without any indication that they are playable',
  },
  videoPlay: {
    title: 'Playing Options',
    description: 'You control how your videos play: On hover, autoplay, or on click.',
  },
  videoSound: {
    title: 'Play with sound',
    description: 'Videos are muted in gallery view by default. Enable to play videos with sound. In Expand Mode, the video will always play with the sound on.',
  },
  videoSpeed: {
    title: 'Playback speed',
    description: 'You control how your videos play: On hover, autoplay, or on click.',
  },
  videoLoop: {
    title: 'Loop videos',
    description: '',
  }
};

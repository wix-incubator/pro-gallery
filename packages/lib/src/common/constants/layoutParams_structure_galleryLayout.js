import optionsMap from '../../core/helpers/optionsMap';

const LAYOUTS = {
  JSON_FIXED: -3,
  DESIGNED_PRESET: -2,
  EMPTY: -1,
  COLLAGE: 0,
  MASONRY: 1,
  GRID: 2,
  THUMBNAIL: 3,
  SLIDER: 4,
  SLIDESHOW: 5,
  PANORAMA: 6,
  COLUMN: 7,
  MAGIC: 8,
  FULLSIZE: 9,
  BRICKS: 10,
  MIX: 11,
  ALTERNATE: 12,
};

const isLayout = (layoutName) => (options) => {
  return options[optionsMap.layoutParams.structure.galleryLayout] === LAYOUTS[layoutName];
};

export default LAYOUTS;
export { isLayout };

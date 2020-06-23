export const processNewStyle = (styles, key) => {
  switch (key) {
    case 'imageOrientation':
      styles.isVertical = styles.imageOrientation === 1;
      break;
    case 'collageAmount':
      styles.collageAmount /= 10;
      break;
    case 'collageDensity':
      styles.collageDensity /= 100;
      break;
    case 'floatingImages':
      styles.floatingImages /= 100;
      break;
    case 'thumbnailSpacings':
      styles.thumbnailSpacings /= 2;
      break;
    case 'cubeType':
      if (styles.cubeType === 'fit') {
        if (styles.cropOnlyFill === true) {
          styles.cubeImages = false;
        }
      }
      break;
    case 'scrollDirection':
      styles.oneRow = styles.scrollDirection === 1;
      if (styles.oneRow) {
        styles.isVertical = false;
      }
      break;
    default:
      break;
  }

  return styles;
};

export const removeFieldsNotNeeded = (json, selectedLayout) => {
  switch (selectedLayout) {
    case 'grid':
      if (json.scrollDirection.value) {
        delete json.gallerySize;
        delete json.numberOfImagesPerRow;
        delete json.gridStyle;
        delete json.titlePlacement;
      } else {
        delete json.numberOfImagesPerCol;
        if (json.gridStyle.value) {
          delete json.gallerySize;
        } else {
          delete json.numberOfImagesPerRow;
        }
      }
      if (json.cubeType.value) {
        delete json.galleryImageRatio;
      }
      break;
    case 'masonry':
      if (json.isVertical.value === 0) {
        delete json.gallerySize;
      } else {
        if (json.gridStyle.value) {
          delete json.gallerySize;
        } else {
          delete json.numberOfImagesPerRow;
        }
      }
      break;
    case 'thumbnails':
      if (json.cubeType.value) {
        delete json.galleryImageRatio;
      }
      break;
    default:
        break;
    }
  return json;
}

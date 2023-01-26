import {
  GalleryProps,
  GALLERY_CONSTS,
  optionsMap,
  utils,
} from 'pro-gallery-lib';
import { CSSProperties } from 'react';

function calculateActiveIndexOffset({
  activeIndex,
  prevActiveIndex,
  activeIndexOffsetMemory,
  items,
}) {
  const itemsLength = items.length;
  if (activeIndex === prevActiveIndex) {
    return activeIndexOffsetMemory;
  }
  activeIndex = utils.inRange(activeIndex, itemsLength);
  const initialRoute = Math.abs(prevActiveIndex - activeIndex);
  const jumpForwardRoute = Math.abs(
    prevActiveIndex - itemsLength - activeIndex
  );
  const jumpBackwardRoute = Math.abs(
    prevActiveIndex + itemsLength - activeIndex
  );
  if (
    jumpBackwardRoute < jumpForwardRoute &&
    jumpBackwardRoute < initialRoute
  ) {
    return activeIndexOffsetMemory - itemsLength;
  }
  if (jumpForwardRoute < jumpBackwardRoute && jumpForwardRoute < initialRoute) {
    return activeIndexOffsetMemory + itemsLength;
  }
  return activeIndexOffsetMemory;
}

export function clearGalleryItems(items: any[], galleryItems: any[]): any[] {
  const clear = (list) =>
    utils
      .uniqueBy(list, 'idx')
      .filter((item) => item.idx !== undefined)
      .sort((a, b) => a.idx - b.idx);
  const clearedGalleryItems = clear(galleryItems);
  return clearedGalleryItems.map((item) => {
    const realItem = items.find((clearedItem) => clearedItem.id === item.id);
    return {
      item: realItem,
      thumbnailItem: item,
      idx: item.idx,
    };
  });
}

export function getThumbnailsData({
  options,
  activeIndex,
  items,
  thumbnailAlignment,
  galleryStructure,
  containerWidth,
  containerHeight,
  activeIndexOffsetMemory = activeIndex,
  prevActiveIndex = activeIndex,
}: {
  options: GalleryProps['options'];
  activeIndex: number;
  items: GalleryProps['items'];
  thumbnailAlignment: string;
  galleryStructure: any;
  containerWidth: number;
  containerHeight: number;
  activeIndexOffsetMemory?: number;
  prevActiveIndex?: number;
}) {
  const galleryItems = clearGalleryItems(items, galleryStructure.galleryItems);
  activeIndexOffsetMemory = calculateActiveIndexOffset({
    activeIndex,
    activeIndexOffsetMemory,
    items: galleryItems,
    prevActiveIndex,
  });
  const activeIndexWithOffset = activeIndexOffsetMemory! + activeIndex;
  const isRTL =
    options[optionsMap.behaviourParams.gallery.layoutDirection] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
      .RIGHT_TO_LEFT;

  if (utils.isVerbose()) {
    console.log('creating thumbnails for idx', activeIndex);
  }

  const withInfiniteScroll = false; // this is not supported yet
  const thumbnailSize = options[optionsMap.layoutParams.thumbnails.size];
  const thumbnailSizeWithSpacing =
    thumbnailSize + options[optionsMap.layoutParams.thumbnails.spacing];
  const horizontalThumbnails =
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM ||
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP;
  const { width, height } = getThumbnailsContainerSize({
    horizontalThumbnails,
    containerWidth,
    containerHeight,
    thumbnailSize,
  });
  const minNumOfThumbnails = getNumberOfThumbnails({
    width,
    height,
    horizontalThumbnails,
  });

  const numberOfThumbnails =
    minNumOfThumbnails % 2 === 1 ? minNumOfThumbnails : minNumOfThumbnails + 1;
  const thumbnailsInEachSide = (numberOfThumbnails - 1) / 2;

  const itemRangeStart = activeIndexWithOffset - thumbnailsInEachSide;
  const itemRangeEnd = itemRangeStart + numberOfThumbnails;

  const itemToDisplay = withInfiniteScroll
    ? utils.sliceArrayWithRange(galleryItems, itemRangeStart, itemRangeEnd)
    : utils.sliceArrayIfAvailable(galleryItems, itemRangeStart, itemRangeEnd);

  const thumbnailsStyle = getThumbnailsStyles({
    horizontalThumbnails,
    width,
    height,
    thumbnailSizeWithSpacing,
    activeIndex: activeIndexWithOffset,
  });

  const thumbnailsStyleWithRTLCalc = isRTL
    ? {
        ...thumbnailsStyle,
        left: undefined,
        top: undefined,
        right: thumbnailsStyle.left,
        bottom: thumbnailsStyle.top,
      }
    : thumbnailsStyle;

  const thumbnailsMargins = getThumbnailsContainerMargin({
    thumbnailAlignment,
    thumbnailsMarginToGallery:
      options[optionsMap.layoutParams.thumbnails.marginToGallery],
  });
  return {
    items: itemToDisplay.map(({ item, thumbnailItem, idx }, index) => {
      const offset = index + itemToDisplay[0].idx;
      return {
        thumbnailItem: thumbnailItem,
        item: item,
        location: getThumbnailLocation({
          thumbnailAlignment,
          offset,
          isRTL,
          thumbnailSizeWithSpacing,
        }),
        idx: idx,
      };
    }),
    thumbnailsMargins,
    horizontalThumbnails,
    thumbnailsStyle: thumbnailsStyleWithRTLCalc,
    activeIndexOffsetMemory,
  };
}

function getThumbnailsContainerSize({
  horizontalThumbnails,
  containerWidth,
  containerHeight,
  thumbnailSize,
}: {
  horizontalThumbnails: boolean;
  containerWidth: number;
  containerHeight: number;
  thumbnailSize: number;
}) {
  if (horizontalThumbnails) {
    return {
      width: containerWidth,
      height: thumbnailSize,
    };
  } else {
    return {
      width: thumbnailSize,
      height: containerHeight,
    };
  }
}

function getNumberOfThumbnails({
  width,
  height,
  horizontalThumbnails,
}: {
  width: number;
  height: number;
  horizontalThumbnails: boolean;
}) {
  if (horizontalThumbnails) {
    return Math.ceil(width / height);
  } else {
    return Math.ceil(height / width);
  }
}

function getThumbnailsStyles({
  horizontalThumbnails,
  width,
  height,
  activeIndex,
  thumbnailSizeWithSpacing,
}: {
  horizontalThumbnails: boolean;
  width: number;
  height: number;
  activeIndex: number;
  thumbnailSizeWithSpacing: number;
}): CSSProperties {
  const baseStyle = {
    overflow: 'visible',
    width,
    height,
  };
  const size = horizontalThumbnails ? width : height;
  const unit = horizontalThumbnails ? 'left' : 'top';
  const distance = thumbnailSizeWithSpacing * activeIndex;
  const initialCenter = size / 2 - thumbnailSizeWithSpacing / 2;

  return {
    ...baseStyle,
    [unit]: distance < initialCenter ? 0 : initialCenter - distance,
  };
}

function getThumbnailsContainerMargin({
  thumbnailAlignment,
  thumbnailsMarginToGallery,
}: {
  thumbnailAlignment: string;
  thumbnailsMarginToGallery: number;
}) {
  const horizontalThumbnails =
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM ||
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP;
  if (horizontalThumbnails) {
    const isTop =
      thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP;
    return {
      marginTop: isTop ? 0 : thumbnailsMarginToGallery,
      marginBottom: isTop ? thumbnailsMarginToGallery : 0,
    };
  }
  const isLeft =
    thumbnailAlignment ===
    GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT;
  return {
    marginLeft: isLeft ? 0 : thumbnailsMarginToGallery,
    marginRight: isLeft ? thumbnailsMarginToGallery : 0,
  };
}

function getThumbnailLocation({
  thumbnailAlignment,
  thumbnailSizeWithSpacing,
  offset,
  isRTL,
}: {
  thumbnailAlignment: string;
  thumbnailSizeWithSpacing: number;
  offset: number;
  isRTL: boolean;
}) {
  const horizontalThumbnails =
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM ||
    thumbnailAlignment ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP;
  const offsetSize = offset * thumbnailSizeWithSpacing;
  if (horizontalThumbnails) {
    return {
      [isRTL ? 'right' : 'left']: offsetSize,
    };
  }
  return {
    [isRTL ? 'bottom' : 'top']: offsetSize,
  };
}

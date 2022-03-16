import { GalleryProps, GALLERY_CONSTS, utils } from 'pro-gallery-lib';
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

export function getThumbnailsData({
  options,
  activeIndex,
  items,
  thumbnailPosition,
  galleryStructure,
  galleryWidth,
  galleryHeight,
  activeIndexOffsetMemory = activeIndex,
  prevActiveIndex = activeIndex,
}: {
  options: GalleryProps['options'];
  activeIndex: number;
  items: GalleryProps['items'];
  thumbnailPosition: string;
  galleryStructure: any;
  galleryWidth: number;
  galleryHeight: number;
  activeIndexOffsetMemory?: number;
  prevActiveIndex?: number;
}) {
  const galleryItems = utils.uniqueBy(galleryStructure.galleryItems, 'id');
  activeIndexOffsetMemory = calculateActiveIndexOffset({
    activeIndex,
    activeIndexOffsetMemory,
    items: galleryItems,
    prevActiveIndex,
  });
  console.log(activeIndexOffsetMemory);
  const activeIndexWithOffset = activeIndexOffsetMemory! + activeIndex;
  const { thumbnailSize, isRTL, thumbnailSpacings } = options;

  if (utils.isVerbose()) {
    console.log('creating thumbnails for idx', activeIndex);
  }

  const thumbnailSizeWithSpacing = thumbnailSize + thumbnailSpacings * 2;
  const horizontalThumbnails =
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.BOTTOM ||
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.TOP;
  const { width, height } = getThumbnailsContainerSize({
    horizontalThumbnails,
    galleryWidth,
    galleryHeight,
    thumbnailSizeWithSpacing,
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
  const itemRangeEnd = activeIndexWithOffset + thumbnailsInEachSide + 1;

  const itemToDisplay = sliceArrayWithRange(
    galleryItems,
    itemRangeStart,
    itemRangeEnd
  );

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
    thumbnailPosition,
    thumbnailSpacings,
  });
  return {
    items: itemToDisplay.map((item, index) => {
      const offset = index + itemRangeStart;
      const idx = galleryItems.indexOf(item);
      return {
        thumbnailItem: item,
        item: items[idx],
        location: getThumbnailLocation({
          thumbnailPosition,
          offset,
          isRTL,
          thumbnailSizeWithSpacing,
        }),
        idx,
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
  galleryWidth,
  galleryHeight,
  thumbnailSizeWithSpacing,
}: {
  horizontalThumbnails: boolean;
  galleryWidth: number;
  galleryHeight: number;
  thumbnailSizeWithSpacing: number;
}) {
  if (horizontalThumbnails) {
    return {
      width: galleryWidth,
      height: thumbnailSizeWithSpacing,
    };
  } else {
    return {
      width: thumbnailSizeWithSpacing,
      height: galleryHeight,
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

function sliceArrayWithRange<T extends any[]>(
  array: T,
  start: number,
  end: number
): T {
  return Array(end - start)
    .fill(0)
    .map((_, i) => {
      const index = start + i;
      return array[utils.inRange(index, array.length)];
    }) as T;
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
  const initialCenter = width / 2 - thumbnailSizeWithSpacing / 2;
  if (horizontalThumbnails) {
    return {
      ...baseStyle,
      left: initialCenter - thumbnailSizeWithSpacing * activeIndex,
    };
  }
  return {
    ...baseStyle,
    top: initialCenter - thumbnailSizeWithSpacing * activeIndex,
  };
}

function getThumbnailsContainerMargin({
  thumbnailPosition,
  thumbnailSpacings,
}: {
  thumbnailPosition: string;
  thumbnailSpacings: number;
}) {
  const horizontalThumbnails =
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.BOTTOM ||
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.TOP;
  if (horizontalThumbnails) {
    const isTop = thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.TOP;
    return {
      marginTop: isTop ? 0 : thumbnailSpacings,
      marginBottom: isTop ? thumbnailSpacings : 0,
    };
  }
  const isLeft = thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.LEFT;
  return {
    marginLeft: isLeft ? 0 : thumbnailSpacings,
    marginRight: isLeft ? thumbnailSpacings : 0,
  };
}

function getThumbnailLocation({
  thumbnailPosition,
  thumbnailSizeWithSpacing,
  offset,
  isRTL,
}: {
  thumbnailPosition: string;
  thumbnailSizeWithSpacing: number;
  offset: number;
  isRTL: boolean;
}) {
  const horizontalThumbnails =
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.BOTTOM ||
    thumbnailPosition === GALLERY_CONSTS.thumbnailsAlignment.TOP;
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

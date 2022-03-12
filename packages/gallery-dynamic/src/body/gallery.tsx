import React, { useMemo, useState } from 'react';
import { IGallery, IItem } from '../types/gallery';
import { Item } from './item';
import { Layouter } from 'pro-layouts';
import { GalleryContext, useRerenderOnScroll } from '../logic/gallery';
import _ from 'lodash';

const baseLayoutParams = {
  styleParams: {
    isVerticalScroll: false,
    isColumnsLayout: true,
    columnSize: 2000,
    minItemSize: 200,
    cropItems: false,
    itemSpacing: 25,
    randomSpacings: 0,
    externalInfoHeight: 0,
    itemsPerGroup: 4,
    smartGrouping: true,
    collageDensity: 1,
  },
};

export function Gallery(props: IGallery) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const { items, layoutParams, baseItemStyling } = props;
  const { container } = layoutParams;
  const layouterParams = _.merge({}, baseLayoutParams, layoutParams);
  const galleryStructure = useMemo(() => {
    return new Layouter(layouterParams).createLayout();
  }, [layoutParams]);
  useRerenderOnScroll(5, containerRef || undefined);

  const itemsRecord = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as { [id: string]: IItem });
  }, [items]);

  return (
    <GalleryContext.Provider value={props}>
      <div
        style={{
          maxHeight: container.height,
          maxWidth: container.width,
          ...container,
          overflow: 'auto',
          position: 'relative',
        }}
        ref={(ref) => {
          setContainerRef(ref);
        }}
      >
        {containerRef &&
          galleryStructure &&
          galleryStructure.groups
            .map((group) => {
              return group.items.map((item) => {
                return {
                  ...item,
                  ...item.offset,
                };
              });
            })
            .flat()
            .map(({ top, left, id, width, height, right, bottom }) => {
              const item = itemsRecord[id];
              return (
                <Item
                  key={id}
                  item={item}
                  container={containerRef!}
                  galleryStructure={galleryStructure}
                  location={{ left, top, width, height, right, bottom }}
                  styling={baseItemStyling}
                />
              );
            })}
      </div>
    </GalleryContext.Provider>
  );
}

import React, { useMemo } from 'react';
import { useRef } from 'react';
import { IGallery, IItem } from '../types/gallery';
import { Item } from './item';
import { Layouter } from 'pro-layouts';
import { GalleryContext } from '../logic/gallery';

export function Gallery(props: IGallery) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { items, layoutParams, baseItemStyling } = props;
  const { container } = layoutParams;
  const layouter = useMemo(() => {
    return new Layouter(layoutParams);
  }, []);
  const galleryStructure = useMemo(() => {
    return layouter.createLayout(layoutParams);
  }, [layoutParams]);

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
          ...container,
        }}
        ref={containerRef}
      >
        {containerRef.current &&
          galleryStructure &&
          galleryStructure.groups
            .map((group) => group.items)
            .flat()
            .map(({ top, left, id }) => {
              const item = itemsRecord[id];
              return (
                <Item
                  key={id}
                  item={item}
                  container={containerRef.current!}
                  galleryStructure={galleryStructure}
                  location={{ left, top }}
                  styling={baseItemStyling}
                />
              );
            })}
      </div>
    </GalleryContext.Provider>
  );
}

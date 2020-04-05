import GalleryItem from '../item/galleryItem';
import GalleryGroup from '../group/galleryGroup';
import utils from '../../common/utils';

export class ItemsHelper {
  static convertDtoToLayoutItem(dto) {
    const isLayoutItem = !!(dto.id && dto.width > 0 && dto.height > 0);
    if (isLayoutItem) {
      return dto;
    } else {
      const dtoMetadata = dto.metadata || dto.metaData;
      const metadata = (typeof dtoMetadata === 'object')
        ? dtoMetadata
        : utils.parseStringObject(dtoMetadata) || {};
      return {
        id: dto.itemId || dto.photoId,
        width: metadata.width,
        height: metadata.height,
        ...dto,
      };
    }
  }

  static convertToGalleryItems(
    galleryStructure,
    itemConfig = {},
    existingItems = [],
  ) {
    galleryStructure.galleryItems = [];
    for (let c = 0; c < galleryStructure.columns.length; c++) {
      const column = galleryStructure.columns[c];
      column.galleryGroups = [];
      const groups = column.groups || column;
      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const groupItems = [];
        for (let i = 0; i < group.items.length; i++) {
          const item = group.items[i];
          const _itemConfig = {
            scheme: item,
            dto: item.dto,
            ...itemConfig,
          };
          const existingItem = existingItems[item.idx];
          let newItem;
          if (existingItem && existingItem.id && existingItem.id === item.id) {
            newItem = existingItem;
            newItem.update(_itemConfig);
          } else {
            newItem = new GalleryItem(_itemConfig);
          }
          groupItems[i] = newItem;
          galleryStructure.galleryItems[item.idx] = groupItems[i];
        }
        column.galleryGroups[g] = new GalleryGroup({
          scheme: group,
          dto: group.dto,
          items: groupItems,
        });
      }
    }

    return galleryStructure;
  }

  static convertExistingStructureToGalleryItems(
    existingStructure,
    galleryStructure,
    itemConfig = {},
  ) {
    // console.log('convertToGalleryItems', existingStructure.galleryItems);
    // console.count('convertToGalleryItems');
    if (utils.isVerbose()) {
      console.time('convertToGalleryItems');
    }
    if (!existingStructure.galleryItems) {
      existingStructure.galleryItems = [];
    }
    const lastColumn = existingStructure.columns.slice(-1)[0];
    const lastGroup = lastColumn.galleryGroups.slice(-1)[0];
    existingStructure.galleryItems.splice(-lastGroup.items.length);
    
    for (let c = 0; c < galleryStructure.columns.length; c++) {
      const column = galleryStructure.columns[c];
      const existingColumn = existingStructure.columns[c] || column;
      if (!existingColumn.galleryGroups) {
        existingColumn.galleryGroups = [];
      }
      // remove last group so it will be rebuilt
      existingColumn.galleryGroups.splice(-1);

      const groups = column.groups || column; 
      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const groupItems = [];
        for (let i = 0; i < group.items.length; i++) {
          const item = group.items[i];
          if (!existingStructure.galleryItems[item.idx]) {
            // console.count(`convertToGalleryItems - item [${item.idx}]`);
            groupItems[i] = new GalleryItem(
              Object.assign(
                {
                  scheme: item,
                  dto: item.dto,
                },
                itemConfig,
              ),
            );
            existingStructure.galleryItems[item.idx] = groupItems[i];
          } else {
            existingStructure.galleryItems[item.idx].processScheme(item);
          }
        } 
        if (!existingColumn.galleryGroups[g]) {
          // console.count(`convertToGalleryItems - group [${g}]`);
          existingColumn.galleryGroups[g] = new GalleryGroup({
            scheme: group,
            dto: group.dto,
            items: groupItems,
          });
        } else {
          existingColumn.galleryGroups[g].processScheme(group);
        }
      }
      column.galleryGroups = existingColumn.galleryGroups;
    }
    galleryStructure.galleryItems = existingStructure.galleryItems;
    if (utils.isVerbose()) {
      console.timeEnd('convertToGalleryItems');
    }
    return galleryStructure;
  }
}

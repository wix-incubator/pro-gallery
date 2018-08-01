import GalleryItem from '../item/galleryItem';
import GalleryGroup from '../group/galleryGroup';
import utils from '../../utils';
import _ from 'lodash';

export class ItemsHelper {

  static convertDtoToLayoutItem(dto) {
    const isLayoutItem = !!(dto.id && dto.width > 0 && dto.height > 0);
    if (isLayoutItem) {
      return dto;
    } else {
      const dtoMetadata = dto.metadata || dto.metaData;
      const metadata = _.isObject(dtoMetadata) ? dtoMetadata : (utils.parseStringObject(dtoMetadata) || {});
      return {
        id: dto.itemId || dto.photoId,
        width: metadata.width,
        height: metadata.height,
        ...dto,
      };
    }
  }

  static convertToGalleryItems(galleryStructure, itemConfig = {}) {
    let pointer = 0;
    galleryStructure.galleryItems = [];
    for (let c = 0; c < galleryStructure.columns.length; c++) {
      const column = galleryStructure.columns[c];
      column.galleryGroups = [];
      const groups = (column.groups || column);
      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const groupItems = [];
        for (let i = 0; i < group.items.length; i++) {
          const item = group.items[i];
          groupItems[i] = new GalleryItem(Object.assign({
            scheme: item,
            dto: item.dto
          }, itemConfig));
          galleryStructure.galleryItems[item.idx] = groupItems[i];
          pointer++;
        }
        column.galleryGroups[g] = new GalleryGroup({
          scheme: group,
          dto: group.dto,
          items: groupItems
        });
      }
    }

    console.log({galleryStructure});

    return galleryStructure;
  }

}

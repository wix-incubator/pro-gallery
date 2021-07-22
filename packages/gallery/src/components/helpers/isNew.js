import { GALLERY_CONSTS } from 'pro-gallery-lib';
export default (
  { items, styles, dimensions, watermark, itemsDimensions },
  state
) => {
  const reason = {
    items: '',
    itemsMetadata: '',
    itemsAdded: '',
    styles: '',
    dimensions: '',
  };

  const watermarkHaveChanged = (newWatermark) => {
    const oldWatermark = state.dimensions;
    if (newWatermark) {
      if (!oldWatermark) {
        reason.watermark = 'first watermark arrived';
        return true;
      } else {
        try {
          const wasChanged =
            JSON.stringify(Object.entries(oldWatermark).sort()) !==
            JSON.stringify(Object.entries(newWatermark).sort());
          if (wasChanged) {
            reason.watermark = 'watermark changed.';
          }
          return wasChanged;
        } catch (e) {
          console.error('Could not compare watermarks', e);
          return false;
        }
      }
    }
    return false;
  };

  const dimensionsHaveChanged = (_dimensions) => {
    if (!state.styles || !state.dimensions) {
      reason.dimensions = 'no old dimensions or styles. ';
      return true; //no old dimensions or styles (style may change dimensions)
    }
    if (!_dimensions) {
      reason.dimensions = 'no new dimensions.';
      return false; // no new continainer
    }
    const dimensionsHaveChanged = {
      height:
        state.styles.scrollDirection ===
          GALLERY_CONSTS.scrollDirection.VERTICAL &&
        state.styles.enableInfiniteScroll
          ? false
          : !!_dimensions.height &&
            _dimensions.height !== state.dimensions.height,
      width:
        !state.dimensions ||
        (!!_dimensions.width && _dimensions.width !== state.dimensions.width),
      scrollBase:
        !!_dimensions.scrollBase &&
        _dimensions.scrollBase !== state.dimensions.scrollBase,
    };
    return Object.keys(dimensionsHaveChanged).reduce((is, key) => {
      if (dimensionsHaveChanged[key]) {
        reason.dimensions += `dimensions.${key} has changed. `;
      }
      return is || dimensionsHaveChanged[key];
    }, false);
  };

  const stylesHaveChanged = (_styles) => {
    if (!_styles) {
      reason.styles = 'no new styles.';
      return false; //no new styles - use old styles
    }
    if (!state.styles) {
      reason.styles = 'no old styles.';
      return true; //no old styles
    }
    try {
      const wasChanged =
        JSON.stringify(Object.entries(_styles).sort()) !==
        JSON.stringify(Object.entries(state.styles).sort());
      if (wasChanged) {
        reason.styles = 'styles were changed.';
      }
      return wasChanged;
    } catch (e) {
      console.error('Could not compare styles', e);
      return false;
    }
  };

  const itemsWereAdded = (_items) => {
    const existingItems = state.items;
    if (_items === state.items) {
      reason.itemsAdded = 'items are the same object.';
      return false; //it is the exact same object
    }
    if (!_items) {
      reason.itemsAdded = 'new items do not exist.';
      return false; // new items do not exist (use old items)
    }
    if (!existingItems || (existingItems && existingItems.length === 0)) {
      reason.itemsAdded = 'old items do not exist.';
      return false; // old items do not exist (it is not items addition)
    }
    if (existingItems.length >= _items.length) {
      reason.itemsAdded = 'more old items than new items.';
      return false; // more old items than new items
    }
    const idsNotChanged = existingItems.reduce((is, _item, idx) => {
      //check that all the existing items exist in the new array
      return is && _item.id === _items[idx].itemId;
    }, true);

    if (!idsNotChanged) {
      reason.itemsAdded = 'items ids were changed. ';
    }
    return idsNotChanged;
  };

  const itemsHaveChanged = (newItems) => {
    const existingItems = state.items;
    if (newItems === state.items) {
      reason.items = 'items are the same object.';
      return false; //it is the exact same object
    }
    if (!newItems) {
      reason.items = 'new items do not exist.';
      return false; // new items do not exist (use old items)
    }
    if (!existingItems || (existingItems && existingItems.length === 0)) {
      reason.items = 'old items do not exist.';
      return true; // old items do not exist
    }
    if (existingItems.length !== newItems.length) {
      reason.items = 'more new items than old items (or vice versa).';
      return true; // more new items than old items (or vice versa)
    }
    return newItems.reduce((is, newItem, idx) => {
      //check that all the items are identical
      const existingItem = existingItems[idx];
      try {
        const itemsChanged =
          is ||
          !newItem ||
          !existingItem ||
          newItem.itemId !== existingItem.itemId ||
          newItem.mediaUrl !== existingItem.mediaUrl ||
          (newItem.metaData &&
            existingItem.metaData &&
            newItem.metaData.type !== existingItem.metaData.type);
        if (itemsChanged) {
          reason.items = `items #${idx} id was changed.`;
        }
        return itemsChanged;
      } catch (e) {
        reason.items = 'an error occured';
        return true;
      }
    }, false);
  };

  const itemsMetadataWasChanged = (newItems) => {
    const existingItems = state.items;

    if (!newItems) {
      reason.itemsMetadata = 'new items do not exist.';
      return false; // new items do not exist (use old items)
    }
    if (!state.items || !existingItems) {
      reason.itemsMetadata = 'old items do not exist.';
      return true; // old items do not exist
    }

    return newItems.reduce((is, newItem, idx) => {
      //check that all the items are identical
      const existingItem = existingItems[idx];
      try {
        const itemsChanged =
          is ||
          JSON.stringify(newItem.metaData) !==
            JSON.stringify(existingItem.metaData);
        if (itemsChanged) {
          reason.itemsMetadata = `item #${idx} data was changed.`;
        }
        return itemsChanged;
      } catch (e) {
        reason.itemsMetadata = 'an error occured.';
        return true;
      }
    }, false);
  };

  const _isNew = {
    items: itemsHaveChanged(items),
    addedItems: itemsWereAdded(items),
    itemsMetadata: itemsMetadataWasChanged(items),
    styles: stylesHaveChanged(styles),
    watermark: watermarkHaveChanged(watermark),
    dimensions: dimensionsHaveChanged(dimensions),
    itemsDimensions: !!itemsDimensions,
  };

  _isNew.str = Object.entries(_isNew)
    .map(([key, is]) => (is ? key : ''))
    .filter((str) => !!str)
    .join('|');
  _isNew.any = _isNew.str.length > 0;
  _isNew.reason = reason;

  // if (!_isNew.any) {
  //   console.count('Tried recreating gallery with no new params');
  // } else {
  //   console.count('Recreating gallery with new params');
  // }

  return _isNew;
};

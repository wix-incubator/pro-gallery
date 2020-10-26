import { Layouter } from 'pro-layouts';
import defaultStyles from '../../common/defaultStyles';
import { addPresetStyles } from '../presets/presets';
import dimensionsHelper from '../helpers/dimensionsHelper';
import { ItemsHelper } from '../helpers/itemsHelper';
import processLayouts from '../helpers/layoutHelper.js'

class Blueprints {

  createBlueprint(params, lastParams, existingBlueprint, blueprintManagerId, isUsingCustomInfoElements) {
    // cacheBlocker
    // if (this.cache[params]) return this.cache[params];

    let changedParams = {};
    try {
      const {dimensions: newDimensionsParams, items: newItemsParams, styles: newStylesParams} = params;
      const {dimensions: oldDimensionsParams, items: oldItemsParams, styles: oldStylesParams} = lastParams;
      // getItems,styles and dimesions if not supplied in params;

      const {formattedItems, changed: itemsChanged} = this.formatItemsIfNeeded(newItemsParams, oldItemsParams)
      const {formattedStyles, changed: stylesChanged} = this.formatStylesIfNeeded(newStylesParams,oldStylesParams,isUsingCustomInfoElements)
      const {formattedContainer, changed: containerChanged} = this.formatContainerIfNeeded(newDimensionsParams, newStylesParams, oldDimensionsParams, oldStylesParams, {formattedStyles: formattedStyles || existingBlueprint.styles});

      const changed = itemsChanged || stylesChanged || containerChanged;
      changedParams = {itemsChanged , stylesChanged , containerChanged};

      if (changed || !existingBlueprint) {
        if (!existingBlueprint) {
          existingBlueprint = {};
        }

        const structure = this.createStructure({formattedContainer: formattedContainer || existingBlueprint.container, formattedItems: formattedItems || existingBlueprint.items, formattedStyles: formattedStyles || existingBlueprint.styles}, changed);
        // assign changed values w/o replacing the original object;
        if (formattedStyles) {existingBlueprint.styles = formattedStyles;}
        if (formattedItems) {existingBlueprint.items = formattedItems;}
        if (formattedContainer) {existingBlueprint.container = formattedContainer;}
        existingBlueprint.structure = structure;

        // if its an infinite gallery - let the container loose
        const isInfinite = !existingBlueprint.styles.oneRow && existingBlueprint.styles.enableInfiniteScroll
        if (isInfinite) {
          existingBlueprint.container.height = existingBlueprint.container.galleryHeight = structure.height;
        }
      }
    } catch(error) {
      console.error('Could not create blueprint, error:', error);
    }
    // return the existing or the modified existing object
    return {blueprint: existingBlueprint, changedParams};
  }

    // ------------------ Raw data to Formated data (if needed) ---------------------------- //


  formatItemsIfNeeded(items, lastItems) {
    const reason = {
      items: '',
      itemsAdded: '',
    };
    const itemsWereAdded = (newItemsParams, oldItemsParams) => {
      if (newItemsParams === oldItemsParams) {
        reason.itemsAdded = 'items are the same object.';
        return false; // it is the exact same object
      }
      if (!newItemsParams) {
        reason.itemsAdded = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldItemsParams || (oldItemsParams && oldItemsParams.length === 0)) {
        reason.itemsAdded = 'old items do not exist.';
        return false; // old items do not exist (it is not items addition)
      }
      if (oldItemsParams.length >= newItemsParams.length) {
        reason.itemsAdded = 'more old items than new items.';
        return false; // more old items than new items
      }
      const idsNotChanged = oldItemsParams.reduce((is, _item, idx) => {
        // check that all the existing items exist in the new array
        return is && _item.id === newItemsParams[idx].itemId;
      }, true);

      if (!idsNotChanged) {
        reason.itemsAdded = 'items ids were changed. ';
      }
      return idsNotChanged;
    };

    const itemsHaveChanged = (newItemsParams, oldItemsParams) => {
      if (newItemsParams === oldItemsParams) {
        reason.items = 'items are the same object.';
        return false; // it is the exact same object
      }
      if (!newItemsParams) {
        reason.items = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldItemsParams || (oldItemsParams && oldItemsParams.length === 0)) {
        reason.items = 'old items do not exist.';
        return true; // old items do not exist
      }
      if (oldItemsParams.length !== newItemsParams.length) {
        reason.items = 'more new items than old items (or vice versa).';
        return true; // more new items than old items (or vice versa)
      }
      return newItemsParams.some((newItem, idx) => {
        // check that all the items are identical
        const existingItem = oldItemsParams[idx];
        try {
          const itemsChanged =
            !newItem ||
            !existingItem ||
            newItem.itemId !== existingItem.itemId ||
            newItem.mediaUrl !== existingItem.mediaUrl ||
            newItem.measured !== existingItem.measured ||
            newItem.metaData && existingItem.metaData && (newItem.metaData.type !== existingItem.metaData.type || newItem.metaData.title !== existingItem.metaData.title || newItem.metaData.description !== existingItem.metaData.description);
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


    const oldItemsParams = lastItems;
    let changed = false;
    let formattedItems;
    if (itemsWereAdded(items, oldItemsParams))
    {
      formattedItems = oldItemsParams.concat(
      items.slice(oldItemsParams.length).map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      }),
      );
      this.gettingMoreItems = false; // probably finished getting more items       //TODO - what is this and how we keep it alive if needed?
      changed = true;
    } else if (itemsHaveChanged(items, oldItemsParams)) {
      formattedItems = items.map(item =>
      Object.assign(ItemsHelper.convertDtoToLayoutItem(item)),
      );
      this.gettingMoreItems = false; // probably finished getting more items
      changed = true;
    }
    return {formattedItems, changed};
  }

  formatStylesIfNeeded(styles, lastStyles, isUsingCustomInfoElements) {


    const reason = {
      styles: '',
    };

    const stylesHaveChanged = (newStylesParams, oldStylesParams) => {
      if (!newStylesParams) {
        reason.styles = 'no new styles.';
        return false; // no new styles - use old styles
      }
      if (!oldStylesParams) {
        reason.styles = 'no old styles.';
        return true; // no old styles
      }
      try {
        const oldStylesSorted = {};
        Object.keys(oldStylesParams).sort() // sort by keys alphabetically
        .forEach(key => oldStylesSorted[key] = oldStylesParams[key]);
        const newStylesSorted = {};
        Object.keys(newStylesParams).sort() // sort by keys alphabetically
        .forEach(key => newStylesSorted[key] = newStylesParams[key]);
        const wasChanged =
          JSON.stringify(newStylesSorted) !== JSON.stringify(oldStylesSorted);
        if (wasChanged) {
          reason.styles = 'styles were changed.';
        }
        return wasChanged;
      } catch (e) {
        console.error('Could not compare styles', e);
        return false;
      }
    };



    const oldStylesParams = lastStyles;
    let changed = false;
    let formattedStyles;
    if (stylesHaveChanged(styles,oldStylesParams)) {
      styles = {...defaultStyles, ...styles}
      formattedStyles = processLayouts(addPresetStyles(styles), isUsingCustomInfoElements); // TODO make sure the processLayouts is up to date. delete addLayoutStyles from layoutsHelper when done with it...

      const selectedLayoutVars = [
        'galleryLayout',
        'galleryThumbnailsAlignment',
        'magicLayoutSeed',
        'cubeType',
        'isVertical',
        'scrollDirection',
        'enableInfiniteScroll',
      ];
      formattedStyles.selectedLayout = selectedLayoutVars
      .map(key => String(formattedStyles[key]))
      .join('|');
      formattedStyles.layoutsVersion = 2;
      changed = true;

    }

    return {formattedStyles, changed}
  }

  formatContainerIfNeeded(dimensions, styles, lastDimensions, lastStyles, {formattedStyles}) {

    const reason = {
      dimensions: '',
    };
    const dimensionsHaveChanged = ({newDimensionsParams, oldDimensionsParams, oldStylesParams}) => {
      if (!oldStylesParams || !oldDimensionsParams) {
        reason.dimensions = 'no old dimensions or styles. ';
        return true; // no old dimensions or styles (style may change dimensions)
      }
      if (!newDimensionsParams) {
        reason.dimensions = 'no new dimensions.';
        return false; // no new continainer
      }
      const dimensionsHaveChanged = {
        height:
          !oldStylesParams.oneRow && oldStylesParams.enableInfiniteScroll
            ? false
            : !!newDimensionsParams.height &&
            newDimensionsParams.height !== oldDimensionsParams.height,
        width:
          !oldDimensionsParams ||
          (!!newDimensionsParams.width &&
            newDimensionsParams.width !== oldDimensionsParams.width),
        scrollBase:
          !!newDimensionsParams.scrollBase &&
          newDimensionsParams.scrollBase !== oldDimensionsParams.scrollBase,
      };
      return Object.keys(dimensionsHaveChanged).reduce((is, key) => {
        if (dimensionsHaveChanged[key]) {
          reason.dimensions += `dimensions.${key} has changed. `;
        }
        return is || dimensionsHaveChanged[key];
      }, false);
    };


    const oldDimensionsParams = lastDimensions;
    let changed = false;
    const oldStylesParams = lastStyles;
    let formattedContainer;
    if(dimensionsHaveChanged({newDimensionsParams: dimensions, oldDimensionsParams, oldStylesParams})){
      dimensionsHelper.updateParams({
        styles: formattedStyles,
        container: dimensions,
      });
      changed = true;
      formattedContainer = Object.assign(
        {},
        dimensions,
        dimensionsHelper.getGalleryDimensions(),
      );

  }
  return {formattedContainer, changed}
}



  createStructure({formattedContainer, formattedStyles, formattedItems}) {


      const layoutParams = {
        items: formattedItems,
        container: formattedContainer,
        styleParams: formattedStyles,
          options: {
          showAllItems: true,
          skipVisibilitiesCalc: true,
          useLayoutStore: false,
        },
      };

      // if (this.layouter && addingItems) {
      //   layoutParams.options.useExistingLayout = true;
      // } else {
        layoutParams.options.createLayoutOnInit = false; // TODO - what does this do?
        this.layouter = new Layouter(layoutParams); // TODO - no need for "this."
      // }

      return this.layouter.createLayout(layoutParams);
  }

}
const blueprints = new Blueprints();
export default blueprints;

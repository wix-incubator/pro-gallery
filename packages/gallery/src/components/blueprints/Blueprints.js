import { addPresetStyles } from '../gallery/presets/presets';
import dimensionsHelper from '../helpers/dimensionsHelper';
// import utils from '../../common/utils';
import { ItemsHelper } from '../helpers/itemsHelper';
import { Layouter } from 'pro-layouts';
// import { createCssLayouts } from '../helpers/cssLayoutsHelper.js';
import { processLayouts } from '../helpers/layoutHelper'
import defaultStyles from '../../common/defaultStyles';



class Blueprints {

  createBlueprint(params, lastParams, existingBlueprint) {
    // cacheBlocker
    // if (this.cache[params]) return this.cache[params];

    const {dimensions: newRawDimensions, items: newRawItems, styles: newRawStyles} =  params
    const {dimensions: oldRawDimensions, items: oldRawItems, styles: oldRawStyles} =  lastParams
    //getItems,styles and dimesions if not supplied in params;

    const {formattedItems, changed: itemsChanged} = this.formatItemsIfNeeded(newRawItems, oldRawItems, existingBlueprint)
    const {formattedStyles, changed: stylesChanged} = this.formatStylesIfNeeded(newRawStyles,oldRawStyles, existingBlueprint)
    const {formattedContainer, changed: containerChanged} = this.formatContainerIfNeeded(newRawDimensions, newRawStyles, oldRawDimensions, oldRawStyles, existingBlueprint);

    const changed = itemsChanged || stylesChanged || containerChanged;
    const changedParams = {itemsChanged , stylesChanged , containerChanged}
    if (changed || !existingBlueprint) {
      console.count('>>>>>>>>>>>> Actually calculating a structure')
      console.log('>>>>>>>>>', {itemsChanged , stylesChanged , containerChanged})
      const structure = this.createStructure({formattedContainer, formattedItems, formattedStyles}, changed);

      const isInfinite = formattedStyles.oneRow && formattedStyles.enableInfiniteScroll
      if (isInfinite) {
        formattedContainer.height = structure.height;
      }

      return {items: formattedItems, styles: formattedStyles, container: formattedContainer, structure, changedParams};// scrollCss};
    }

    return {...existingBlueprint, changedParams};

  }
    
    // ------------------ Raw data to Formated data (if needed) ---------------------------- //


  formatItemsIfNeeded(items, lastItems, existingBlueprint) {
    const reason = {
      items: '',
      itemsAdded: '',
    };
    const itemsWereAdded = (newRawItems, oldRawItems) => {
      if (newRawItems === oldRawItems) {
        reason.itemsAdded = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!newRawItems) {
        reason.itemsAdded = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldRawItems || (oldRawItems && oldRawItems.length === 0)) {
        reason.itemsAdded = 'old items do not exist.';
        return false; // old items do not exist (it is not items addition)
      }
      if (oldRawItems.length >= newRawItems.length) {
        reason.itemsAdded = 'more old items than new items.';
        return false; // more old items than new items
      }
      const idsNotChanged = oldRawItems.reduce((is, _item, idx) => {
        //check that all the existing items exist in the new array
        return is && _item.id === newRawItems[idx].itemId;
      }, true);
  
      if (!idsNotChanged) {
        reason.itemsAdded = 'items ids were changed. ';
      }
      return idsNotChanged;
    };
  
    const itemsHaveChanged = (newRawItems, oldRawItems) => {
      if (newRawItems === oldRawItems) {
        reason.items = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!newRawItems) {
        reason.items = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldRawItems || (oldRawItems && oldRawItems.length === 0)) {
        reason.items = 'old items do not exist.';
        return true; // old items do not exist
      }
      if (oldRawItems.length !== newRawItems.length) {
        reason.items = 'more new items than old items (or vice versa).';
        return true; // more new items than old items (or vice versa)
      }
      return newRawItems.reduce((is, newItem, idx) => {
        //check that all the items are identical
        const existingItem = oldRawItems[idx];
        try {
          const itemsChanged =
            is ||
            !newItem ||
            !existingItem ||
            newItem.itemId !== existingItem.itemId ||
            newItem.mediaUrl !== existingItem.mediaUrl || 
            newItem.metaData && existingItem.metaData && newItem.metaData.type !== existingItem.metaData.type;
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


    const oldRawItems = lastItems;
    let changed = false;
    let formattedItems = existingBlueprint.items;
    if (itemsWereAdded(items, oldRawItems))
    {
      formattedItems = oldRawItems.concat(
      items.slice(oldRawItems.length).map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      }),
      );
      this.gettingMoreItems = false; //probably finished getting more items       //TODO - what is this and how we keep it alive if needed?
      changed = true;
    } else if (itemsHaveChanged(items, oldRawItems)) {
      formattedItems = items.map(item =>
      Object.assign(ItemsHelper.convertDtoToLayoutItem(item)),
      );
      this.gettingMoreItems = false; //probably finished getting more items
      changed = true;
    }
    return {formattedItems, changed};
  }

  formatStylesIfNeeded(styles, lastStyles, existingBlueprint) {


    const reason = {
      styles: '',
    };

    const stylesHaveChanged = (newRawStyles, oldRawStyles) => {
      if (!newRawStyles) {
        reason.styles = 'no new styles.';
        return false; //no new styles - use old styles
      }
      if (!oldRawStyles) {
        reason.styles = 'no old styles.';
        return true; //no old styles
      }
      try {
        const oldStylesSorted = {};
        Object.keys(oldRawStyles).sort() //sort by keys alphabetically
        .forEach(key => oldStylesSorted[key] = oldRawStyles[key]);
        const newStylesSorted = {};
        Object.keys(newRawStyles).sort() //sort by keys alphabetically
        .forEach(key => newStylesSorted[key] = newRawStyles[key]);
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



    const oldRawStyles = lastStyles;
    let changed = false;
    let formattedStyles = existingBlueprint.styles;
    if (stylesHaveChanged(styles,oldRawStyles)) {
      styles = {...defaultStyles, ...styles}
      formattedStyles = processLayouts(addPresetStyles(styles)); // TODO make sure the processLayouts is up to date. delete addLayoutStyles from layoutsHelper when done with it...

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

  formatContainerIfNeeded(dimensions, styles, lastDimensions, lastStyles, existingBlueprint) {

    const reason = {
      dimensions: '',
    };
    const dimensionsHaveChanged = ({newRawDimensions, oldRawDimensions, oldRawStyles}) => {
      if (!oldRawStyles || !oldRawDimensions) {
        reason.dimensions = 'no old dimensions or styles. ';
        return true; //no old dimensions or styles (style may change dimensions)
      }
      if (!newRawDimensions) {
        reason.dimensions = 'no new dimensions.';
        return false; // no new continainer
      }
      const dimensionsHaveChanged = {
        height:
          !oldRawStyles.oneRow && oldRawStyles.enableInfiniteScroll
            ? false
            : !!newRawDimensions.height &&
            newRawDimensions.height !== oldRawDimensions.height,
        width:
          !oldRawDimensions ||
          (!!newRawDimensions.width &&
            newRawDimensions.width !== oldRawDimensions.width),
        scrollBase:
          !!newRawDimensions.scrollBase &&
          newRawDimensions.scrollBase !== oldRawDimensions.scrollBase,
      };
      return Object.keys(dimensionsHaveChanged).reduce((is, key) => {
        if (dimensionsHaveChanged[key]) {
          reason.dimensions += `dimensions.${key} has changed. `;
        }
        return is || dimensionsHaveChanged[key];
      }, false);
    };


    const oldRawDimensions = lastDimensions;
    let changed = false;
    const oldRawStyles = lastStyles;
    let formattedContainer = existingBlueprint.container;
    dimensionsHelper.updateParams({
      styles,
      container: dimensions,
    });
    if(dimensionsHaveChanged({newRawDimensions: dimensions, oldRawDimensions, oldRawStyles})){
      changed = true;
      formattedContainer = Object.assign(
        {},
        dimensions,
        dimensionsHelper.getGalleryDimensions(),
      );

  }
  return {formattedContainer,changed}
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
        layoutParams.options.createLayoutOnInit = false; //TODO - what does this do?
        this.layouter = new Layouter(layoutParams); //TODO - no need for "this."
      // }
  
      return this.layouter.createLayout(layoutParams);
  }

}
const blueprints = new Blueprints();
export default blueprints;
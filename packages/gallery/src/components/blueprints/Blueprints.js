import { addPresetStyles } from '../gallery/presets/presets';
import dimensionsHelper from '../helpers/dimensionsHelper';
import defaultStyles from '../../common/defaultStyles';
import utils from '../../common/utils';
import { ItemsHelper } from '../helpers/itemsHelper';
// import window from '../../../common/window/windowWrapper';
import { Layouter } from 'pro-layouts';
import { cssScrollHelper } from '../helpers/cssScrollHelper.js';
import { createCssLayouts } from '../helpers/cssLayoutsHelper.js';
import { isEditMode , isSEOMode} from '../../common/window/viewModeWrapper';
import EVENTS from '../../common/constants/events';
import { processLayouts } from '../helpers/layoutHelper'


export default class Blueprints {
  constructor(config){
    this.eventsCB = config && config.eventsCB;
    this.lastParams = config && config.lastParams || {};
    this.existingBlueprint = config && config.existingBlueprint || {};
  }

    handleNewGalleryStructure() { // TODO rework completely
      //should be called AFTER new state is set
      const {
        container,
        needToHandleShowMoreClick,
        initialGalleryHeight,
      } = this.state;
      const styleParams = this.state.styles;
      const numOfItems = this.items.length;
      const layoutHeight = this.layout.height;
      const layoutItems = this.layout.items;
      const isInfinite = this.containerInfiniteGrowthDirection() === 'vertical';
      let updatedHeight = false;
      const needToUpdateHeightNotInfinite =
        !isInfinite && needToHandleShowMoreClick;
      if (needToUpdateHeightNotInfinite) {
        const showMoreContainerHeight = 138; //according to the scss
        updatedHeight =
          container.height +
          (initialGalleryHeight -
            showMoreContainerHeight);
      }
  
      const onGalleryChangeData = {
        numOfItems,
        container,
        styleParams,
        layoutHeight,
        layoutItems,
        isInfinite,
        updatedHeight,
      };
  
      this.eventsListener(EVENTS.GALLERY_CHANGE, onGalleryChangeData);
    }
  
    eventsListener(eventName, eventData, event) {
      if (typeof this.props.eventsListener === 'function') {
        this.eventsCB(eventName, eventData, event);
      }
    }

  createBlueprint(params) {
    // cacheBlocker
    // if (this.cache[params]) return this.cache[params];

    const {dimensions: newRawDimensions, items: newRawItems, styles: newRawStyles, domId} =  this.completeBuildingBlocks(params)
    //getItems,styles and dimesions if not supplied in params;

    dimensionsHelper.updateParams({ // styles process will need an updated dimensionsHelper
      domId: domId,
      container: newRawDimensions, //this is a wrong format untill we have it with all the scrollbase etc.... must work on uniting the dim helpers..
      styles: newRawStyles
    });
    this.thingsChanged = false;
    const formattedItems = this.formatItemsIfNeeded(newRawItems)
    const formattedStyles = this.formatStylesIfNeeded(newRawStyles)
    const formattedContainer = this.formatContainerIfNeeded(newRawDimensions);

    const structure = this.createStructureIfNeeded({formattedContainer, formattedItems, formattedStyles});
    
    
    const layoutCss = this.createCssLayoutsIfNeeded({formattedContainer, formattedItems, formattedStyles, structure, domId})
    // const scrollCss = this.getScrollCssIfNeeded({
      //   domId, formattedStyles, structure
      // });
    this.updateLastParamsIfNeeded({dimensions: newRawDimensions, items: newRawItems, styles: newRawStyles, domId});
    return this.existingBlueprint = {items: formattedItems, styles: formattedStyles, container: formattedContainer, structure, layoutCss,};// scrollCss};

  }


    // ------------------ Get all the needed raw data ---------------------------- //
    completeBuildingBlocks(params) {
      
    let {dimensions, container, items, styles, styleParams, options, domId} = params || {};

    styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    dimensions = {...dimensions, ...container}
    dimensions =  this.fetchDimensionsIfNeeded(dimensions);
    items =  this.fetchItemsIfNeeded(items);
    styles =  this.fetchStylesIfNeeded(styles); //can be async... TODO

    return {dimensions, items, styles, domId} 
  }
  
  
  fetchDimensionsIfNeeded(dimensions) {

    const shouldFetchDimensions = (dimensions) => {
      let should = true;
      if(dimensions) {
        should = false
      } 
      
      return should;
    }
    
    if (shouldFetchDimensions(dimensions)) {
      //dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
    }
    
    return dimensions;
  }
  
  fetchItemsIfNeeded(items) {
    
    const shouldFetchItems = (items) => {
      let should = true;
      if(items) {
        should = false
      }
      
      return should;
    }

    if (shouldFetchItems(items)) {
      //items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  fetchStylesIfNeeded(styles) {

    const shouldFetchStyles = (styles) => {
      let should = true;
      if(styles) { //TODO - should check if they are ready styles and use ClientLib if not?
        should = false
      }

      return should;
    }

    if (shouldFetchStyles(styles)) {
      //styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
    }

    return styles;
  }

    // ------------------ Raw data to Formated data (if needed) ---------------------------- //


  formatItemsIfNeeded(items) {
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


    const oldRawItems = this.lastParams.items || [];
    let formattedItems = this.existingBlueprint.items;
    if (itemsWereAdded(items, oldRawItems))
    {
      formattedItems = oldRawItems.concat(
      items.slice(oldRawItems.length).map(item => {
        return ItemsHelper.convertDtoToLayoutItem(item);
      }),
      );
      this.gettingMoreItems = false; //probably finished getting more items       //TODO - what is this and how we keep it alive if needed?
      this.thingsChanged = true;
    } else if (itemsHaveChanged(items, oldRawItems)) {
      formattedItems = items.map(item =>
      Object.assign(ItemsHelper.convertDtoToLayoutItem(item)),
      );
      this.gettingMoreItems = false; //probably finished getting more items
      this.thingsChanged = true;
    }
    return formattedItems;
  }

  formatStylesIfNeeded(styles) {


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



    const oldRawStyles = this.lastParams.styles || {};
    let finalStyles = this.existingBlueprint.styles;
    if (stylesHaveChanged(styles,oldRawStyles)) {

      finalStyles = processLayouts(addPresetStyles(styles)); // TODO make sure the processLayouts is up to date. delete addLayoutStyles from layoutsHelper when done with it...

      const selectedLayoutVars = [
        'galleryLayout',
        'galleryThumbnailsAlignment',
        'magicLayoutSeed',
        'cubeType',
        'isVertical',
        'scrollDirection',
        'enableInfiniteScroll',
      ];
      finalStyles.selectedLayout = selectedLayoutVars
      .map(key => String(finalStyles[key]))
      .join('|');
      finalStyles.layoutsVersion = 2;
      this.thingsChanged = true;

      

    }  

    return finalStyles
  }

  formatContainerIfNeeded(dimensions, styles) {

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


    const oldRawDimensions = this.lastParams.dimensions;
    const oldRawStyles = this.lastParams.styles;
    dimensionsHelper.updateParams({
      styles,
      container: dimensions,
    });
    if(dimensionsHaveChanged({newRawDimensions: dimensions, oldRawDimensions, oldRawStyles})){
      this.thingsChanged = true;
      return Object.assign(
        {},
        dimensions,
        dimensionsHelper.getGalleryDimensions(),
      );
    } else {
      return this.existingBlueprint.container
    }
  }



  createStructureIfNeeded({formattedContainer, formattedStyles, formattedItems}) {

    if (this.thingsChanged) {
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
        this.layouter = new Layouter(layoutParams);
      // }
  
      this.layout = this.layouter.createLayout(layoutParams);
      
      return this.layout;
    } else {
      return this.existingBlueprint.structure;
    }
  }

  createCssLayoutsIfNeeded({formattedContainer, formattedItems, formattedStyles, structure, domId}) {

    if (this.thingsChanged) {
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
      const isApproximateWidth = dimensionsHelper.isUnknownWidth() && !formattedStyles.oneRow; //FAKE SSR - TODO ask guy about this
      return createCssLayouts({
        layoutParams,
        isApproximateWidth,
        isMobile: utils.isMobile(),
        domId: domId,
        galleryItems: isApproximateWidth? null : structure.items,
      });
    } else {
      return this.existingBlueprint.layoutCss;
    }
  }

  getScrollCssIfNeeded({ domId, formattedStyles, structure}) {
    if (this.thingsChanged) {
      const shouldUseScrollCss = !isSEOMode();
      const allowPreloading = isEditMode();
      let scrollCss = [];
      if (shouldUseScrollCss) {
        scrollCss = cssScrollHelper.calcScrollCss({
          items: structure.items,
          isUnknownWidth: dimensionsHelper.isUnknownWidth(),
          styleParams: formattedStyles,
          domId,
          allowPreloading,
        });
      }
      return (scrollCss && scrollCss.length > 0) ? scrollCss : this.existingBlueprint.scrollCss;
    } else {
      return this.existingBlueprint.scrollCss;
    }
  }

  updateLastParamsIfNeeded(params) {
    if(this.thingsChanged){
      this.lastParams = params;
    }
  }
}
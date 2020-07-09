import blueprints from './Blueprints'
// import EVENTS from '../../common/constants/events';

class BlueprintsManager {

  constructor() {
    // this.eventsCB = config && config.eventsCB;
    this.currentState = {};
    this.existingBlueprint = {};
    this.cache = {};
    this.currentState.totalItemsCount = Infinity;
    this.onBlueprintReady = (() => {});
  }

  setInitialBlueprint({initialState, initialBlueprint}) {
    this.currentState = initialState || this.currentState;
    this.existingBlueprint = initialBlueprint || this.existingBlueprint;
  }

  init(config) { // is this init? should dump cache
    // this.onBlueprintReady = config && config.onBlueprintReady || this.onBlueprintReady;
    this.api = config.api;
    this.currentState.totalItemsCount = config && config.totalItemsCount || this.currentState.totalItemsCount;
  }

  getOrCreateBlueprint(params) {
    console.count('>>>>>>>>>>requestingBlueprint'); //TODO - remove when done :D


    this.currentState.totalItemsCount = params.totalItemsCount ? params.totalItemsCount : this.currentState.totalItemsCount;

    params =  {...params,...this.completeParams(params)}

    const {changedParams, ...blueprint} = blueprints.createBlueprint(params, this.currentState, this.existingBlueprint);

    this.updateLastParamsIfNeeded(params, changedParams);
    this.existingBlueprint = blueprint;
    return this.cache[params] = {...blueprint};
  }

  getMoreItems(currentItemLength) {
    let items;
    if (currentItemLength < this.currentState.totalItemsCount) {
      // this.gettingMoreItems = true;
      items = this.api.fetchMoreItems(currentItemLength);
      if (items) {
        this.api.onBlueprintReady(this.getOrCreateBlueprint({items}));
        //work with the new items...
      }
    } else if (this.existingBlueprint.styles.slideshowLoop) {
      this.duplicateGalleryItems();
    }
  }

  duplicateGalleryItems() {
      const items = this.currentState.items.concat(
        ...this.currentState.items.slice(0, this.currentState.totalItemsCount),
      );
        this.api.onBlueprintReady(this.getOrCreateBlueprint({items}));
  }




    // ------------------ Get all the needed raw data ---------------------------- //
    completeParams(params) {
    
    let {dimensions, container, items, styles, styleParams, options, domId} = params || {};

    styles = {...options, ...styles, ...styleParams };
    dimensions = {...dimensions, ...container}
    dimensions =  this.fetchDimensionsIfNeeded(dimensions);
    items =  this.fetchItemsIfNeeded(items);
    styles =  this.fetchStylesIfNeeded(styles); //can be async... TODO

    return {dimensions, items, styles, domId} 
  }
  
  
  fetchDimensionsIfNeeded(dimensions) {

    const shouldFetchDimensions = (_dimensions) => {
      let should = true;
      if(_dimensions && Object.keys(_dimensions).length > 0) {
        should = false
      } 
      
      return should;
    }
    
    if (shouldFetchDimensions(dimensions)) {
      //dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
      dimensions = (this.api.fetchDimensions && this.api.fetchDimensions()) || this.currentState.dimensions;
    }
    
    return dimensions;
  }
  
  fetchItemsIfNeeded(items) {
    
    const shouldFetchItems = (_items) => {
      let should = true;
      if(_items && _items.length > 0) {
        should = false
      }
      
      return should;
    }

    if (shouldFetchItems(items)) {
      //items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
      items = (this.api.fetchItems && this.api.fetchItems()) || this.currentState.items;
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  fetchStylesIfNeeded(styles) {

    const shouldFetchStyles = (_styles) => {
      let should = true;
      if(_styles && Object.keys(_styles).length > 0) { //TODO - should check if they are ready styles and use ClientLib if not?
        should = false
      }

      return should;
    }
    if (shouldFetchStyles(styles)) {
      //styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
      styles = this.api.fetchStyles && this.api.fetchStyles() || this.currentState.styles;
    }

    return styles;
  }


  updateLastParamsIfNeeded({items,dimensions,styles}, changedParams) {
    this.currentState.items = changedParams.itemsChanged ? items : this.currentState.items ;
    this.currentState.dimensions = changedParams.containerChanged ? {...dimensions} : this.currentState.dimensions ;
    this.currentState.styles = changedParams.stylesChanged ? {...styles} : this.currentState.styles ;
  }

  eventsListenerWrapper(eventsListenerFunc, originalArgs) {
    const eventHandledInternaly = this.internalEventHandler(...originalArgs)
    !eventHandledInternaly && eventsListenerFunc(...originalArgs);
  }

  needMoreItems(currentItemLength) {
    this.getMoreItems(currentItemLength);
  }

}

const blueprintsManager = new BlueprintsManager();
export default blueprintsManager;
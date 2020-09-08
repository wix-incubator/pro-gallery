import blueprints from './Blueprints'
import { viewModeWrapper } from '../../common/window/viewModeWrapper'

export default class BlueprintsManager {

  constructor({id}) {
    // this.eventsCB = config && config.eventsCB;
    this.id = id + `'s blueprintsManager`
    this.currentState = {};
    this.existingBlueprint = {};
    this.cache = {};
    this.api = {};
    this.currentState.totalItemsCount = Infinity;
    this.onBlueprintReady = (() => {});
    this.loopingItems = false;
  }

  init(config) {
    this.api = config.api;
    this.currentState.totalItemsCount = config && config.totalItemsCount || this.currentState.totalItemsCount;
    viewModeWrapper.setFormFactor(config.formFactor);
  }

  async createBlueprint(params = {}) {

    this.currentState.totalItemsCount = params.totalItemsCount || this.api.getTotalItemsCount && this.api.getTotalItemsCount()  || this.currentState.totalItemsCount;
    
    this.currentState.isUsingCustomInfoElements = params.isUsingCustomInfoElements || this.api.isUsingCustomInfoElements && this.api.isUsingCustomInfoElements()  || this.currentState.isUsingCustomInfoElements;

    params =  {...params,... await this.completeParams(params)}

    const {blueprint, changedParams} = blueprints.createBlueprint(params, this.currentState, this.existingBlueprint, this.id, this.currentState.isUsingCustomInfoElements);

    const blueprintChanged = Object.values(changedParams).some(changedParam => !!changedParam);

    this.updateLastParamsIfNeeded(params, changedParams);

    this.api.onBlueprintReady && this.api.onBlueprintReady({blueprint, blueprintChanged});
    return this.cache[params] = this.existingBlueprint = blueprint;

  }

  async getMoreItems(currentItemLength) {
    let items;
    if (currentItemLength < this.currentState.totalItemsCount) {
      // this.gettingMoreItems = true;
      items = await this.api.fetchMoreItems(currentItemLength);
      if (items) {
        this.createBlueprint({items})
        // work with the new items...
      }
    } else if (this.existingBlueprint.styles.slideshowLoop) {
      this.duplicateGalleryItems();
    }
  }

  resetItemLooping() {
    this.loopingItems = false;
  }

  duplicateGalleryItems() {
      const items = this.currentState.items.concat(
        ...this.currentState.items.slice(0, this.currentState.totalItemsCount),
      );
      this.loopingItems = true;
      this.createBlueprint({items});
  }




    // ------------------ Get all the needed raw data ---------------------------- //
    async completeParams(params) {

    let {dimensions, container, items, styles, styleParams, options, domId} = params || {};

    styles = {...options, ...styles, ...styleParams };
    dimensions = {...dimensions, ...container}
    dimensions =  await this.fetchDimensionsIfNeeded(dimensions);
    items =  await this.fetchItemsIfNeeded(items);
    styles =  await this.fetchStylesIfNeeded(styles); // can be async... TODO

    return {dimensions, items, styles, domId}
  }


  async fetchDimensionsIfNeeded(dimensions) {

    const shouldFetchDimensions = (_dimensions) => {
      let should = true;
      if(_dimensions && Object.keys(_dimensions).length > 0) {
        should = false
      }

      return should;
    }

    if (shouldFetchDimensions(dimensions)) {
      // dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
      dimensions = (this.api.fetchDimensions && await this.api.fetchDimensions()) || this.currentState.dimensions;
    }

    return dimensions;
  }

  async fetchItemsIfNeeded(items) {

    const shouldFetchItems = (_items) => {
      let should = true;
      if(_items && _items.length > 0) {
        should = false
      }

      return should;
    }

    if (shouldFetchItems(items)) {
      // items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
      items = (!this.loopingItems && this.api.fetchItems && await this.api.fetchItems()) || this.currentState.items;
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  async fetchStylesIfNeeded(styles) {

    const shouldFetchStyles = (_styles) => {
      let should = true;
      if(_styles && Object.keys(_styles).length > 0) { // TODO - should check if they are ready styles and use ClientLib if not?
        should = false
      }

      return should;
    }
    if (shouldFetchStyles(styles)) {
      // styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
      styles = this.api.fetchStyles && await this.api.fetchStyles() || this.currentState.styles;
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

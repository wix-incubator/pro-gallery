/* eslint-disable prettier/prettier */
import blueprints from './Blueprints.js';
import { GALLERY_CONSTS, optionsMap, viewModeWrapper } from 'pro-gallery-lib';
//Wow! such amazing code here!
export default class BlueprintsManager {
  constructor({ id }) {
    this.id = id + `'s blueprintsManager`;
    this.currentState = {};
    this.existingBlueprint = {};
    this.lastBlueprintId = 0;
    this.cache = {};
    this.api = {};
    this.currentState.totalItemsCount = Infinity;
    this.onBlueprintReady = () => {};
    this.loopingItems = false;
  }

  init(config) {
    this.api = config.api;
    this.currentState.totalItemsCount =
      (config && config.totalItemsCount) || this.currentState.totalItemsCount;
    viewModeWrapper.setDeviceType(config.deviceType);
  }

  setCurrentBlueprint(id) {
    this.lastBlueprintId = id;
  }

  async createBlueprint(params = {}) {
    const lastBlueprintId = Math.floor(Math.random() * 1000);

    this.currentState.totalItemsCount =
      params.totalItemsCount ||
      (this.api.getTotalItemsCount && this.api.getTotalItemsCount()) ||
      this.currentState.totalItemsCount;

    this.currentState.isUsingCustomInfoElements =
      params.isUsingCustomInfoElements ||
      (this.api.isUsingCustomInfoElements &&
        this.api.isUsingCustomInfoElements()) ||
      this.currentState.isUsingCustomInfoElements;

    params = { ...params, ...(await this.completeParams(params)) };

    params = this.duplicateItemsForSlideshowLoopIfNeeded(params);

    const _createBlueprint = async (args) => {
      this.setCurrentBlueprint(args.blueprintManagerId);
      if (this.api.createBlueprintImp) {
        return await this.api.createBlueprintImp(args);
      } else {
        return await blueprints.createBlueprint(args);
      }
    };
    const { blueprintManagerId, blueprint, changedParams, reasons } = await _createBlueprint({
      params,
      lastParams: this.currentState,
      existingBlueprint: this.existingBlueprint,
      blueprintManagerId: this.id + lastBlueprintId,
      isUsingCustomInfoElements: this.currentState.isUsingCustomInfoElements,
    });

    if (blueprintManagerId !== this.lastBlueprintId) return;

    const blueprintChanged = Object.values(changedParams).some(
      (changedParam) => !!changedParam
    );

    const blueprintCreated = Object.keys(blueprint).length > 0;

    this.updateLastParamsIfNeeded(params, changedParams, blueprintCreated);

    await new Promise((resolve) => setTimeout(resolve, 0)); //yeild to main thread. (this splits the task to 2 frames, so the UI thread will not be blocked for too long)
    
    blueprintCreated &&
      this.api.onBlueprintReady &&
      this.api.onBlueprintReady({ blueprint, blueprintChanged, reasons });
    return (this.cache[params] = this.existingBlueprint = blueprint); // still returning for awaits... event is !blueprintCreated
  }

  async getMoreItems(currentItemLength) {
    let items;
    if (currentItemLength < this.currentState.totalItemsCount) {
      // this.gettingMoreItems = true;
      items = await this.api.fetchMoreItems(currentItemLength);
      if (items) {
        this.createBlueprint({ items });
        // work with the new items...
      }
    } else if (this.existingBlueprint.options[optionsMap.behaviourParams.gallery.horizontal.loop] ) { 
      this.duplicateItemsAndCreateBlueprint();
    }
  }

  resetItemLooping() {
    this.loopingItems = false;
  }

  createInitialBlueprint(params) {
    this.currentState.totalItemsCount =
      params.totalItemsCount ||
      (this.api.getTotalItemsCount && this.api.getTotalItemsCount()) ||
      this.currentState.totalItemsCount;

    this.currentState.isUsingCustomInfoElements =
      params.isUsingCustomInfoElements ||
      (this.api.isUsingCustomInfoElements &&
        this.api.isUsingCustomInfoElements()) ||
      this.currentState.isUsingCustomInfoElements;

    params = this.duplicateItemsForSlideshowLoopIfNeeded(params);

    const { blueprint, changedParams, reasons } = blueprints.createBlueprint({
      params,
      lastParams: this.currentState,
      existingBlueprint: this.existingBlueprint,
      blueprintManagerId: this.id,
      isUsingCustomInfoElements: this.currentState.isUsingCustomInfoElements,
    });

    const blueprintChanged = Object.values(changedParams).some(
      (changedParam) => !!changedParam
    );

    const blueprintCreated = Object.keys(blueprint).length > 0;

    this.updateLastParamsIfNeeded(params, changedParams, blueprintCreated);
    
    blueprintCreated &&
      this.api.onBlueprintReady &&
      this.api.onBlueprintReady({
        blueprint,
        blueprintChanged,
        reasons,
        initialBlueprint: true,
      });
    return (
      blueprintCreated &&
      (this.cache[params] = this.existingBlueprint = blueprint)
    );
  }

  createSingleBlueprint(params = {}) {
    let { isUsingCustomInfoElements } = params;

    const { blueprint } = blueprints.createBlueprint({
      params,
      lastParams: {},
      existingBlueprint: {},
      blueprintManagerId: this.id + '_singleBlueprint',
      isUsingCustomInfoElements,
    });

    return blueprint;
  }

  duplicateGalleryItems( {items, duplicateFactor = 1}) {
    items = items || this.currentState.items;
    const uniqueItems = items.slice(0, this.currentState.totalItemsCount);
    for (let i = 0; i < duplicateFactor; i++){      
      items = items.concat(...uniqueItems);
    }
    this.loopingItems = true;
    return items;
  }

  // Wrapper for the duplicateGalleryItems func, it duplicates, and createBlueprint with duplicated items *
  duplicateItemsAndCreateBlueprint(){
    const items = this.duplicateGalleryItems({});
    this.createBlueprint({items})
  }

// The following function duplicate the items if necessary for slideshowLoop
  duplicateItemsForSlideshowLoopIfNeeded(params){
    const { items, options } = params;
    const { totalItemsCount } = this.currentState;
    const loopThreshold = 30;
    // If we've reached last items (no more items in server), and there are less items than the threshold
    const numOfItemsCondition = items.length < loopThreshold && items.length === totalItemsCount;
    // If the gallery is a horizontal scrolling gallery
    const isHorizontalScrolling = options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].HORIZONTAL;
    // If slideshowLoop is True and both conditions are True as well then we duplicate number of items to reach threshold
    if (options[optionsMap.behaviourParams.gallery.horizontal.loop] && numOfItemsCondition && isHorizontalScrolling){
      const duplicateFactor = Math.ceil(loopThreshold / items.length) - 1;
      return {...params, items: this.duplicateGalleryItems({items, duplicateFactor})};
    }
    return params;
  }

  // ------------------ Get all the needed raw data ---------------------------- //
  async completeParams(params) {
    let { container, items, options, id } = params || {}
    container = await this.fetchContainerIfNeeded(container);
    items = await this.fetchItemsIfNeeded(items);
    options = await this.fetchOptionsIfNeeded(options); // can be async... TODO

    return { container, items, options, id };
  }

  async fetchContainerIfNeeded(container) {
    const shouldFetchContainer = (_container) => {
      let should = true;
      if (_container && Object.keys(_container).length > 0) {
        should = false;
      }

      return should;
    };

    if (shouldFetchContainer(container)) {
      // dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
      container =
        (this.api.fetchContainer && (await this.api.fetchContainer())) ||
        this.currentState.container;
    }

    return container;
  }

  async fetchItemsIfNeeded(items) {
    const shouldFetchItems = (_items) => {
      let should = true;
      if (_items && _items.length > 0) {
        should = false;
      }

      return should;
    };

    if (shouldFetchItems(items)) {
      // items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
      items =
        (!this.loopingItems &&
          this.api.fetchItems &&
          (await this.api.fetchItems())) ||
        this.currentState.items;
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  async fetchOptionsIfNeeded(options) {
    const shouldFetchOptions = (_options) => {
      let should = true;
      if (_options && Object.keys(_options).length > 0) {
        // TODO - should check if they are ready options and use ClientLib if not?
        should = false;
      }

      return should;
    };
    if (shouldFetchOptions(options)) {
      // styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
      options =
        (this.api.fetchOptions && (await this.api.fetchOptions())) ||
        this.currentState.options;
    }

    return options;
  }

  updateLastParamsIfNeeded(
    { items, container, options },
    changedParams,
    blueprintCreated
  ) {
    if (blueprintCreated) {
      this.currentState.items = changedParams.itemsChanged
        ? items
        : this.currentState.items;
      this.currentState.container = changedParams.containerChanged
        ? { ...container }
        : this.currentState.container;
      this.currentState.options = changedParams.optionsChanged
        ? { ...options }
        : this.currentState.options;
    }
  }

  needMoreItems(currentItemLength) {
    this.getMoreItems(currentItemLength);
  }
}
/* eslint-enable prettier/prettier */

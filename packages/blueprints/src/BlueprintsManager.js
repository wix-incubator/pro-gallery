/* eslint-disable prettier/prettier */
import blueprints from './Blueprints';
import { viewModeWrapper } from 'pro-gallery-lib';

export default class BlueprintsManager {
  constructor({ id }) {
    this.id = id + `'s blueprintsManager`;
    this.currentState = {};
    this.existingBlueprint = {};
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

  async createBlueprint(params = {}) {
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

    const _createBlueprint = async (args) => {
      if (this.api.createBlueprintImp) {
        return await this.api.createBlueprintImp(args);
      } else {
        return await blueprints.createBlueprint(args);
      }
    };
    const { blueprint, changedParams } = await _createBlueprint({
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
      this.api.onBlueprintReady({ blueprint, blueprintChanged });
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
    } else if (this.existingBlueprint.styles.slideshowLoop) {
      this.duplicateGalleryItems();
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

    params = this.alignParamNamingOptions(params);

    const { blueprint, changedParams } = blueprints.createBlueprint({
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
        initialBlueprint: true,
      });
    return (
      blueprintCreated &&
      (this.cache[params] = this.existingBlueprint = blueprint)
    );
  }

  createSingleBlueprint(params = {}) {
    let { isUsingCustomInfoElements } = params;
    params = this.alignParamNamingOptions(params);

    const { blueprint } = blueprints.createBlueprint({
      params,
      lastParams: {},
      existingBlueprint: {},
      blueprintManagerId: this.id + '_singleBlueprint',
      isUsingCustomInfoElements,
    });

    return blueprint;
  }

  duplicateGalleryItems() {
    const items = this.currentState.items.concat(
      ...this.currentState.items.slice(0, this.currentState.totalItemsCount)
    );
    this.loopingItems = true;
    this.createBlueprint({ items });
  }

  // ------------------ Get all the needed raw data ---------------------------- //
  async completeParams(params) {
    let { container, items, styles, id } =
      this.alignParamNamingOptions(params);
    container = await this.fetchContainerIfNeeded(container);
    items = await this.fetchItemsIfNeeded(items);
    styles = await this.fetchStylesIfNeeded(styles); // can be async... TODO

    return { container, items, styles, id };
  }

  alignParamNamingOptions(params) {
    let { container, items, styles, styleParams, options, id } =
      params || {};

    styles = { ...options, ...styles, ...styleParams };

    return { container, items, styles, id };
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

  async fetchStylesIfNeeded(styles) {
    const shouldFetchStyles = (_styles) => {
      let should = true;
      if (_styles && Object.keys(_styles).length > 0) {
        // TODO - should check if they are ready styles and use ClientLib if not?
        should = false;
      }

      return should;
    };
    if (shouldFetchStyles(styles)) {
      // styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
      styles =
        (this.api.fetchStyles && (await this.api.fetchStyles())) ||
        this.currentState.styles;
    }

    return styles;
  }

  updateLastParamsIfNeeded(
    { items, container, styles },
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
      this.currentState.styles = changedParams.stylesChanged
        ? { ...styles }
        : this.currentState.styles;
    }
  }

  needMoreItems(currentItemLength) {
    this.getMoreItems(currentItemLength);
  }
}
/* eslint-enable prettier/prettier */

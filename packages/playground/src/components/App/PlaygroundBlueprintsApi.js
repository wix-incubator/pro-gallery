export default class PlaygroundsBlueprintsApi {
  constructor({ addItems, getItems, getContainer, getOptions, onBlueprintReady, getTotalItemsCount }) {
    this.addItems = addItems || (() => {});
    this.getItems = getItems || (() => {});
    this.getOptions = getOptions || (() => {});
    this.getContainer = getContainer || (() => {});
    this.getTotalItemsCount = getTotalItemsCount || (() => {});
    this.onBlueprintReadyCallback = onBlueprintReady || (() => {});
    // this.setDimensionsHeight = this.setDimensionsHeight || (()=>{});
  }

  updateFunctions({ addItems, getItems, getContainer, getOptions, onBlueprintReady, getTotalItemsCount }) {
    this.addItems = addItems || this.addItems;
    this.getItems = getItems || this.getItems;
    this.getOptions = getOptions || this.getOptions;
    this.getContainer = getContainer || this.getContainer;
    this.getTotalItemsCount = getTotalItemsCount || this.getTotalItemsCount;
    this.onBlueprintReadyCallback = onBlueprintReady || this.onBlueprintReadyCallback;
    // this.setDimensionsHeight = this.setDimensionsHeight || (()=>{});
  }

  fetchMoreItems() {
    this.addItems();
  }

  fetchItems() {
    return this.getItems();
  }

  fetchOptions() {
    return this.getOptions();
  }

  fetchContainer() {
    return this.getContainer();
  }

  onBlueprintReady({ blueprint }) {
    this.onBlueprintReadyCallback(blueprint);
  }

  isUsingCustomInfoElements() {
    return true;
  }
}

export default class PlaygroundsBlueprintsApi {

  constructor({addItems, getItems, getContainer, getStyles, onBlueprintReady, getTotalItemsCount}){
    this.addItems = addItems || (()=>{});
    this.getItems = getItems || (()=>{});
    this.getStyles = getStyles || (()=>{});
    this.getContainer = getContainer || (()=>{});
    this.getTotalItemsCount = getTotalItemsCount || (()=>{});
    this.onBlueprintReadyCallback = onBlueprintReady || (()=>{});
    // this.setDimensionsHeight = this.setDimensionsHeight || (()=>{});
  }

  updateFunctions({addItems, getItems, getContainer, getStyles, onBlueprintReady, getTotalItemsCount}){
    this.addItems = addItems || this.addItems;
    this.getItems = getItems || this.getItems;
    this.getStyles = getStyles || this.getStyles;
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

  fetchStyles() {
    return this.getStyles();
  }

  fetchDimensions() {
    return this.getContainer();
  }

  onBlueprintReady({blueprint, blueprintChanged}) {
    this.onBlueprintReadyCallback(blueprint);
  }

  isUsingCustomInfoElements(){
    return true;
  }

}
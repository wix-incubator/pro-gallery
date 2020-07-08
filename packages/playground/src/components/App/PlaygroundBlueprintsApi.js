export default class PlaygroundsBlueprintsApi {

  constructor({addItems, getItems, getContainer, getStyles, onBlueprintReady}){
    this.addItems = addItems || (()=>{});
    this.getItems = getItems || (()=>{});
    this.getStyles = getStyles || (()=>{});
    this.getContainer = getContainer || (()=>{});
    this.onBlueprintReadyCallback = onBlueprintReady || (()=>{});
  }

  updateFunctions({addItems, getItems, getContainer, getStyles, onBlueprintReady}){
    this.addItems = addItems || this.addItems;
    this.getItems = getItems || this.getItems;
    this.getStyles = getStyles || this.getStyles;
    this.getContainer = getContainer || this.getContainer;
    this.onBlueprintReadyCallback = onBlueprintReady || this.onBlueprintReadyCallback;
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

  onBlueprintReady(blueprint) {
    this.onBlueprintReadyCallback(blueprint);
  }

  finalizeHeightByStructure({
    styleParams,
  }) {
    
    if (styleParams.oneRow) {
      return window.innerHeight;
    } else {
      return false;
    }

}

}
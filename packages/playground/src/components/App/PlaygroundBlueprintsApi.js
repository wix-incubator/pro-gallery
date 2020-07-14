export default class PlaygroundsBlueprintsApi {

  constructor({addItems, getItems, getContainer, getStyles, onBlueprintReady}){
    this.addItems = addItems || (()=>{});
    this.getItems = getItems || (()=>{});
    this.getStyles = getStyles || (()=>{});
    this.getContainer = getContainer || (()=>{});
    this.onBlueprintReadyCallback = onBlueprintReady || (()=>{});
    // this.setDimensionsHeight = this.setDimensionsHeight || (()=>{});
  }

  updateFunctions({addItems, getItems, getContainer, getStyles, onBlueprintReady}){
    this.addItems = addItems || this.addItems;
    this.getItems = getItems || this.getItems;
    this.getStyles = getStyles || this.getStyles;
    this.getContainer = getContainer || this.getContainer;
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

  // finalizeHeightByStructure({
  //   styleParams,
  //   isInfinite,
  //   updatedHeight,
  //   layoutHeight,
  //   container,
  // }) {
  //   let newHeight = container.height;
    
  //   if (styleParams.oneRow) {
  //     newHeight = window.innerHeight;
  //   } else {
  //     if(isInfinite || updatedHeight === Infinity) {
  //       newHeight = layoutHeight;
  //     } else if (updatedHeight > 0) {
  //       newHeight = updatedHeight;
  //     } 
  //   }
  //   if (!(container.height === newHeight) && newHeight){
  //     // this.setDimensionsHeight(newHeight);
  //   }
// }

}
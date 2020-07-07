export default class PlaygroundsBlueprintsApi {

  constructor({addItems, getItems, getContainer, getStyles, onBlueprintReady}){
    this.addItems = addItems || (()=>{});
    this.getItems = getItems || (()=>{});
    this.getStyles = getStyles || (()=>{});
    this.getContainer = getContainer || (()=>{});

    this.onBlueprintReadyCallback = onBlueprintReady || (()=>{});
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


}
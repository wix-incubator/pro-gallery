export default class PlaygroundsBlueprintsApi {

  constructor(functions){
    this.addItems = functions.addItems || (()=>{});
    this.getItems = functions.getItems || (()=>{});
    this.getStyles = functions.getStyles || (()=>{});
    this.getContainer = functions.getContainer || (()=>{});
    this.setBlueprint = functions.setBlueprint || (()=>{});
  }

  addSetBlueprintFunction(func) {
    this.setBlueprint = func;
  }

  getMoreItems() {
    this.addItems();
  }
  getItems() {
    return this.getITems();
  }
  getStyles() {
    return this.getStyles();
  }
  getDimensions() {
    return this.getContainer();
  }

  onBlueprintReady(blueprint) {
    this.setBlueprint(blueprint);
  }


}
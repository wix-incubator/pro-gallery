import blueprints from './Blueprints'


class BlueprintsManager {

  constructor(config) {
    this.eventsCB = config && config.eventsCB;
    this.lastParams = config && config.lastParams || {};
    this.existingBlueprint = config && config.existingBlueprint || {};
    this.cache = {};
  }

  getOrCreateBlueprint(params) {
        // cacheBlocker
        // if (this.cache[params]) return this.cache[params];
    params =  this.completeBuildingBlocks(params)
    const lastparams = this.lastParams;
    const existingBlueprint = this.existingBlueprint;
    return this.cache[params] = blueprints.createBlueprint(params, lastparams, existingBlueprint);
  }







    // ------------------ Get all the needed raw data ---------------------------- //
    completeBuildingBlocks(params) {
      
    let {dimensions, container, items, styles, styleParams, options, domId} = params || {};

    styles = {...options, ...styles, ...styleParams };
    dimensions = {...dimensions, ...container}
    dimensions =  this.fetchDimensionsIfNeeded(dimensions);
    items =  this.fetchItemsIfNeeded(items);
    styles =  this.fetchStylesIfNeeded(styles); //can be async... TODO

    return {dimensions, items, styles, domId} 
  }
  
  
  fetchDimensionsIfNeeded(dimensions) {

    const shouldFetchDimensions = (dimensions) => {
      let should = true;
      if(dimensions) {
        should = false
      } 
      
      return should;
    }
    
    if (shouldFetchDimensions(dimensions)) {
      //dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
    }
    
    return dimensions;
  }
  
  fetchItemsIfNeeded(items) {
    
    const shouldFetchItems = (items) => {
      let should = true;
      if(items) {
        should = false
      }
      
      return should;
    }

    if (shouldFetchItems(items)) {
      //items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  fetchStylesIfNeeded(styles) {

    const shouldFetchStyles = (styles) => {
      let should = true;
      if(styles) { //TODO - should check if they are ready styles and use ClientLib if not?
        should = false
      }

      return should;
    }

    if (shouldFetchStyles(styles)) {
      //styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
    }

    return styles;
  }


  updateLastParamsIfNeeded(params) {
    if(this.thingsChanged){
      this.lastParams = params;
    }
  }
}

const blueprintsManager = new BlueprintsManager();
export default blueprintsManager;